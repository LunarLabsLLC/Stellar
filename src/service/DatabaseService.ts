export class DatabaseService {
    public static getMongoURI(config: any): string {
        return config["MONGO URI"] + "/" + config["DATABASE NAME"]
    }
}