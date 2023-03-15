import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

const main = async () => {
	const orm = await MikroORM.init({
		dbName: 'post_me_daddy',
		type: "postgresql",
		user: 'pgt',
		entities: [Post],
		debug: !__prod__
	});
}
