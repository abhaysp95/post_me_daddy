"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230318071514 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230318071514 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
    }
    async down() {
        this.addSql('alter table "user" drop column "created_at";');
        this.addSql('alter table "user" drop column "updated_at";');
    }
}
exports.Migration20230318071514 = Migration20230318071514;
//# sourceMappingURL=Migration20230318071514.js.map