import argon2 from "argon2";
import {MyContext} from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver
} from "type-graphql";

import {User} from "../entities/User";

@InputType()
class UsernamePasswordInput {

  @Field() username!: string;

  @Field() password!: string;
}

@ObjectType()
class FieldError {

  @Field() field: string;

  @Field() message: string;
}

@ObjectType()
class UserResponse {

  @Field(() => [FieldError], {nullable : true}) errors?: FieldError[];

  @Field(() => User, {nullable : true}) user?: User;
}

@Resolver()
export class UserResolver {

  // another way instead of using multiple args, create a class with multiple
  // args and use it
  /* @Mutation(() => User)
  register(@Arg("username") username: string,
           @Arg("password") password: string,
           @Ctx() { em }: MyContext): Promise<User> {
                           // ...
  } */

  @Mutation(() => UserResponse)
  async register(@Arg("options") options: UsernamePasswordInput,
                 @Ctx() { em }: MyContext): Promise<UserResponse> {

    // validation
    if (options.username.length <= 2) {
      return {
        errors: [ {
          field : 'username',
          message : 'Provided username with length > 2',
        } ]
      }
    }
    if (options.password.length <= 2) {
      return {
        errors: [ {
          field : 'username',
          message : 'Provided password with length > 2',
        } ]
      }
    }

    // to store hashed password
    const hashedPassword = await argon2.hash(options.password, {
      type : argon2.argon2id, // hybrid one
      hashLength : 64,
      memoryCost : 2 ** 16,
      timeCost : 5,
      // no need to worry about salt, as this module already generates good
      // random salt and stores it,
      // https://github.com/ranisalt/node-argon2/issues/76#issuecomment-291553840
    });
    const user = em.create(
        User, {username : options.username, password : hashedPassword});
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      // validate if username provided already exists
      if (error.code === "23505" || error.detail.includes("already exists")) {
        return {
          errors: [ {field : 'username', message : 'Username already exists'} ]
        }
      }
    }
    return {user};
  }

  @Mutation(() => UserResponse, {nullable : true})
  async login(@Arg("options") options: UsernamePasswordInput,
              @Ctx() { em, req }: MyContext): Promise<UserResponse|null> {
    const user = await em.findOne(User, {username : options.username});
    if (!user) { // username provided doesn't exist
      return {
        errors: [ {
          field : 'username',
          message : "Couldn't find provided username",
        } ],
      }
    }
    const hashPassword = await argon2.verify(user.password, options.password);
    if (!hashPassword) { // password provided didn't matched
      return {
        errors : [ {
          field : 'password',
          message : 'Incorrect password provided',
        } ]
      };
    }

	// store user id within cookie for a session
	req.session.userId = user.id;

    return {
      user,
    };
  }
}
