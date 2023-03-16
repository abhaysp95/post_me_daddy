import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	orm.getMigrator().up()

	/* const generator = orm.getSchemaGenerator();
	await generator.createSchema(); */

	const em = orm.em.fork()
	/* const post = em.create(Post, {title: 'my first post'}); // an instance of post
	await em.persistAndFlush(post); */

	const posts = await em.find(Post, {});
	console.log(posts);


}

main().catch(err => {
	console.error(err);
});
