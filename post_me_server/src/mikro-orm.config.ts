import { defineConfig, /* Options */ } from "@mikro-orm/core";
// import { MikroORM } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";

export default defineConfig({
  entities: [Post], // no need for `entitiesTs` this way
  dbName: 'post_me_daddy',
  type: 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  user: 'pgt',
  debug: !__prod__
});

// if not using defineConfig, here are few other ways to make it work with TS
/* const mikroConfig: Options = {
  entities: [Post], // no need for `entitiesTs` this way
  dbName: 'post_me_daddy',
  type: 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  user: 'pgt',
  debug: !__prod__
};

export default mikroConfig; */

// or
/* export default {
  entities: [Post], // no need for `entitiesTs` this way
  dbName: 'post_me_daddy',
  type: 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  user: 'pgt',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]; */
