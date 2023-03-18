import {User} from "../entities/User";
import {MyContext} from "src/types";
import {Arg, Ctx, Field, InputType, Mutation, Resolver} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {

	@Field()
	username!: string;

	@Field()
	password!: string;

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

 @Mutation(() => User)
 async register(@Arg("options") options: UsernamePasswordInput, @Ctx() { em }: MyContext): Promise<User> {
	 const hashedPassword = await argon2.hash(options.password);
	 const user = em.create(User, { username: options.username, password: hashedPassword });
	 await em.persistAndFlush(user);
	 return user;
 }

}
