import {MyContext} from "src/types";
import {Arg, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";

import {Post} from "../entities/Post";

@Resolver()
export class PostResolver {

  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {})
  }

  @Query(() => Post, {nullable : true})
  /* could be null if nothing found with given id */
  post(@Arg('id', () => ID) id: number, @Ctx() { em }: MyContext):
      Promise<Post|null> {
    return em.findOne(Post, {id})
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string, @Ctx() { em }: MyContext):
      Promise<Post> {
    let post = em.create(Post, {title});
    await em.persistAndFlush(post);
    return post
  }

  @Mutation(() => Post, {nullable : true})
  async updatePost(@Arg("id", () => ID) id: number,
                   @Arg("title", {nullable : true}) title: string,
                   @Ctx() { em }: MyContext): Promise<Post|null> {
    let post = await em.findOne(Post, {id})
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined" && title !== null) {
      post.title = title;
      post.updatedAt = new Date();
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => ID) id: number, @Ctx() { em }: MyContext):
      Promise<boolean> {
    /* using nativeDelete for conditional deletion */
    return await em.nativeDelete(Post, {id}).then(_ => true, _ => false);
  }
}
