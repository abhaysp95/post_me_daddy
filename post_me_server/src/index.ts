import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	const post = orm.em.create(Post, {title: 'my first post'}); // an instance of post
	await orm.em.persistAndFlush(post);
}

main().catch(err => {
	console.error(err);
});