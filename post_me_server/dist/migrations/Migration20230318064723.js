"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230318064723 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230318064723 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "username" text not null, "password" text not null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    }
    async down() {
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20230318064723 = Migration20230318064723;
//# sourceMappingURL=Migration20230318064723.js.map