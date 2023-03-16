"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    orm.getMigrator().up();
    const app = (0, express_1.default)();
    app.get('/:name', (request, response) => {
        response.write(`Hello ${request.params.name}`, () => {
            console.log(`Sent hello to ${request.params.name}`);
        });
        response.end().status(200);
    });
    app.listen(4000, () => {
        console.log("server started at 4000");
    });
};
main().catch(err => {
    console.error(err);
});
//# sourceMappingURL=index.js.map