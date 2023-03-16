import {defineConfig, /* Options */} from "@mikro-orm/core";
import path from "path";

// import { MikroORM } from "@mikro-orm/postgresql";
import {__prod__} from "./constants";
import {Post} from "./entities/Post";

export default defineConfig({
  migrations : {
    path : path.join(__dirname,
                     './migrations'), // path to the folder with migrations
    pathTs : undefined, // path to the folder with TS migrations (if used, we
                        // should put path to compiled files in `path`)
    glob : '!(*.d).{js,ts}', // how to match migration files (all .js and .ts
                             // files, but not .d.ts)
    disableForeignKeys : false
  },
  entities : [ Post ], // no need for `entitiesTs` this way
  dbName : 'post_me_daddy',
  type : 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` |
                       // `sqlite`
  user : 'pgt',
  debug : !__prod__
});

// if not using defineConfig, here are few other ways to make it work with TS
/* const mikroConfig: Options = {
  entities: [Post], // no need for `entitiesTs` this way
  dbName: 'post_me_daddy',
  type: 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` |
`sqlite` user: 'pgt', debug: !__prod__
};

export default mikroConfig; */

// or
/* export default {
  entities: [Post], // no need for `entitiesTs` this way
  dbName: 'post_me_daddy',
  type: 'postgresql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` |
`sqlite` user: 'pgt', debug: !__prod__ } as Parameters<typeof MikroORM.init>[0];
*/
