import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import express from "express";

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	orm.getMigrator().up()

	/* const generator = orm.getSchemaGenerator();
	await generator.createSchema(); */

	// const em = orm.em.fork()
	/* const post = em.create(Post, {title: 'my first post'}); // an instance of post
	await em.persistAndFlush(post); */

	/* const posts = await em.find(Post, {});
	console.log(posts); */

   const app = express();
   /* app.get('/:name', (request, response) => {
	   response.send(`Hello ${request.params.name}`).status(200);
   }) */
   app.get('/:name', (request, response) => {
	   response.write(`Hello ${request.params.name}`, () => {
		   console.log(`Sent hello to ${request.params.name}`);
	   })
	   response.end().status(200); // send() can be called once, but write() many times, it needs end() to tell the end() else it's blocking
   })
   app.listen(4000, () => {
	   console.log("server started at 4000")
   })

}

main().catch(err => {
	console.error(err);
});
