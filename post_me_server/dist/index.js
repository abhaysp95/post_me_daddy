"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const core_1 = require("@mikro-orm/core");
const body_parser_1 = require("body-parser");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const redis_1 = require("redis");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
async function retry(command) {
    let retries = 5;
    while (retries) {
        try {
            console.log("retry: ", retry);
            return command();
        }
        catch (err) {
            console.log("retry error: ", err);
            retries -= 1;
            await new Promise(res => setTimeout(res, 2500));
        }
    }
}
const main = async () => {
    console.log("env: ", process.env);
    const orm = await retry(() => { return core_1.MikroORM.init(mikro_orm_config_1.default); });
    const em = orm.em.fork();
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    let redisClient = (0, redis_1.createClient)({
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        }
    });
    retry(() => { redisClient.connect(); });
    let redisStore = new connect_redis_1.default({
        client: redisClient,
        prefix: "myapp:",
        disableTouch: true,
    });
    app.use((0, express_session_1.default)({
        name: 'qid',
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 86400,
            httpOnly: true,
            sameSite: "lax",
            secure: constants_1.__prod__,
        }
    }));
    const apolloServer = new server_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver, user_1.UserResolver],
            validate: false,
        }),
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
    });
    await apolloServer.start();
    app.use('/graphql', (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: async ({ req, res }) => ({ req, res, em })
    }));
    app.get('/:name', (request, response) => {
        response.write(`Hello ${request.params.name}`, () => { console.log(`Sent hello to ${request.params.name}`); });
        response.end().status(200);
    });
    await new Promise((resolve) => httpServer.listen({ port: 4000, host: "0.0.0.0" }, resolve));
    console.log("Server running at: http://localhost:4000");
};
main()
    .catch(err => { console.error(err); });
//# sourceMappingURL=index.js.map