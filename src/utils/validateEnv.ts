import process from 'node:process';

export const validateEnv = () => {
	if (!process.env.BOT_TOKEN) {
		console.warn('Missing `BOT_TOKEN` in .env');
		return false;
	}

	if (!process.env.MONGO_URI) {
		console.warn('Missing `MONGO_URI` in .env');
		return false;
	}

	return true;
};
