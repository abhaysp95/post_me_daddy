import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Request, Response } from "express"
// import { Session, SessionData } from "express-session";
import session from "express-session"

/**
 * Intersection of session.Session from "express-session" and User["id"] from
 * User entity
 */
// type UserSession = session.Session & { userid: User["id"] };

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare module 'express-session' {
	export interface SessionData {
		userId: number;
	}
}

export type ResolverContext = {
	em: EntityManager<IDatabaseDriver<Connection>>;
	req: Request & { session: session.Session }
	res: Response;
}
