export class DatabaseService {
    public static getMongoURI(config: any): string {
        return config["MONGO_URI"] + "/" + config["DATABASE_NAME"]
    }
}