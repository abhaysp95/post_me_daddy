"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
exports.default = (0, core_1.defineConfig)({
    entities: [Post_1.Post],
    dbName: 'post_me_daddy',
    type: 'postgresql',
    user: 'pgt',
    debug: !constants_1.__prod__
});
//# sourceMappingURL=mikro-orm.config.js.map