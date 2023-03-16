"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
exports.default = (0, core_1.defineConfig)({
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pathTs: undefined,
        glob: '!(*.d).{js,ts}',
        disableForeignKeys: false
    },
    entities: [Post_1.Post],
    dbName: 'post_me_daddy',
    type: 'postgresql',
    user: 'pgt',
    debug: !constants_1.__prod__
});
//# sourceMappingURL=mikro-orm.config.js.map