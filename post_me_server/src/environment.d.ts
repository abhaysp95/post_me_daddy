declare global {
	namespace NodeJS {
		interface ProcessEnv {
			POSTGRES_PORT?: number,
			REDIS_PORT?: number,
		}
	}
}

export {}
