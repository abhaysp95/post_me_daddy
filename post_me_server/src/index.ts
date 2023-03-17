import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {
  ApolloServerPluginDrainHttpServer
} from '@apollo/server/plugin/drainHttpServer';
// import {startStandaloneServer} from '@apollo/server/standalone';
import {MikroORM} from "@mikro-orm/core";
import {json} from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import {buildSchema} from 'type-graphql';

import {__prod__} from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import {HelloResolver} from "./resolvers/hello";

const main =
    async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up()

  /* const generator = orm.getSchemaGenerator();
  await generator.createSchema(); */

  // const em = orm.em.fork()
  /* const post = em.create(Post, {title: 'my first post'}); // an instance of
  post await em.persistAndFlush(post); */

  /* const posts = await em.find(Post, {});
  console.log(posts); */

  const app = express();
  const httpServer = http.createServer(app);
  /* app.get('/:name', (request, response) => {
          response.send(`Hello ${request.params.name}`).status(200);
  }) */

  const apolloServer = new ApolloServer({
    schema : await buildSchema({
      resolvers : [ HelloResolver ],
      validate : false,
    }),
    // to drain the "httpServer" for graceful shutdown of the server
    plugins : [ ApolloServerPluginDrainHttpServer({httpServer}) ]
  });
  await apolloServer.start();

  // using a middleware (order of app.use() for middleware matters)
  app.use('/graphql', cors<cors.CorsRequest>(), json(),
          expressMiddleware(
              apolloServer,
              {context : async ({req}) => ({token : req.headers.token})}));

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

  await new Promise<void>((resolve) =>
							  httpServer.listen({port : 4000}, resolve));
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

main().catch(err => { console.error(err); });
