"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const main = async () => {
    const orm = await core_1.MikroORM.init({
        dbName: 'post_me_daddy',
        type: "postgresql",
        user: 'pgt',
        entities: [Post_1.Post],
        debug: !constants_1.__prod__
    });
};
//# sourceMappingURL=index.js.map