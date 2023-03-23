import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {
  ApolloServerPluginDrainHttpServer
} from '@apollo/server/plugin/drainHttpServer';
// import {startStandaloneServer} from '@apollo/server/standalone';
import {Connection, IDatabaseDriver, MikroORM} from "@mikro-orm/core";
import {json} from "body-parser";
import RedisStore from 'connect-redis';
import cors from "cors";
import express from "express";
import session from 'express-session';
import http from "http";
import {createClient} from 'redis';
import {buildSchema} from 'type-graphql';

import {__prod__} from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';
import {ResolverContext} from './types';

async function retryConnection<T>(command: () => Promise<T>| void): Promise<T|void> {
  let retries = 5;
  while (retries) {
    try {
      console.log("retry: ", retryConnection);
      return command();
    } catch (err) {
      console.log("retry error: ", err);
      retries -= 1;
      await new Promise(res => setTimeout(res, 2500));
    }
  }
}

const main =
    async () => {

  const orm = await retryConnection(() => { return MikroORM.init(mikroConfig); }) as
              MikroORM<IDatabaseDriver<Connection>>;

  /* const generator = orm.getSchemaGenerator();
  await generator.createSchema(); */

  const em = orm.em.fork()
  /* const post = em.create(Post, {title: 'my first post'}); // an instance of
  post await em.persistAndFlush(post); */

  /* const posts = await em.find(Post, {});
  console.log(posts); */

  const app = express();
  /* app.set("trust proxy", !__prod__);
  app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
  app.set("Access-Control-Allow-Credentials", true); */

  const httpServer = http.createServer(app);
  /* app.get('/:name', (request, response) => {
          response.send(`Hello ${request.params.name}`).status(200);
  }) */

  // initialize redis client
  let redisClient = createClient({
    socket : {
      host : process.env.REDIS_HOST,
      port : process.env.REDIS_PORT,
    }
  });

  retryConnection(() => {redisClient.connect()});

  /* remember to install "redis server" and make it running on your system (or
   * any other connecting way you desire) */

  // initialize redis store
  let redisStore = new RedisStore({
    client : redisClient,
    prefix : "myapp:",
    disableTouch : true, // atleast, for now
  })

  // initialize session storage middleware
  // this middleware needs to run before apollo-graphql middleware, thus order
  // matters
  app.use(session({
    name : 'qid',
    store : redisStore,
    resave : false, // recommended: fore lightweight session keep alive
    saveUninitialized : false,
    secret : process.env.SESSION_SECRET!, // decrypt the cookie (should be randomly
                                 // generated and better used as env variable)
    cookie : {
      maxAge : 86400, // a day
      httpOnly : true,
      sameSite :
          "lax", // top-level, safe cross-site requests,
                 // https://stackoverflow.com/questions/59990864/what-is-the-difference-between-samesite-lax-and-samesite-strict
      secure : __prod__, // set https-only cookie for prod env
    }
  }))

  const apolloServer = new ApolloServer({
    schema : await buildSchema({
      resolvers : [ HelloResolver, PostResolver, UserResolver ],
      validate : false,
    }),
    // to drain the "httpServer" for graceful shutdown of the server
    plugins : [ ApolloServerPluginDrainHttpServer({httpServer}) ]
  });
  await apolloServer.start();

  // app.use(cors());
  // using a middleware (order of app.use() for middleware matters)
  app.use('/graphql', cors<cors.CorsRequest>(), json(),
          expressMiddleware(apolloServer,
                            // context is accessible by all resolvers (passing
                            // context to integration function of choice, either
                            // expressMiddleware() or startStandaloneServer())
                            {
                              context : async({req, res}) :
                                  Promise<ResolverContext> => ({req, res, em})
                            }));

  app.get('/:name',
          (request, response) => {
            response.write(
                `Hello ${request.params.name}`,
                () => { console.log(`Sent hello to ${request.params.name}`); })
            response.end().status(
                200); // send() can be called once, but write() many times, it
                      // needs end() to tell the end() else it's blocking
          })
      /* app.listen(4000, () => {
              console.log("server started at 4000")
      }) */

      /**
       * using "startStandaloneServer"
       * creates and express app
       * installs ApolloServer as middleware
       * prepares your app to handle incoming request
       */
      /* const { url } = await startStandaloneServer(apolloServer, {
              listen: { port: 4000 },
      }); */

      await new Promise<void>((resolve) => httpServer.listen(
                                  {port : 4000, host : "0.0.0.0"}, resolve));
  console.log("Server running at: http://localhost:4000");
  // just something to try, will finish later
  /* httpServer.on('error', (e: Error) => {
    console.log("error name:", e.name)
    if (e.name === 'EADDRINUSE') {
      console.log("Address already in use. Retrying...")
      setTimeout(async () => {
        httpServer.close();
        await new Promise<void>((resolve) =>
                                    httpServer.listen({port : 4000}, resolve));
      }, 1000);
    }
    else {
      console.error("Can't connect:", e)
    }
  }) */
}

                main()
                    .catch(err => { console.error(err); });
