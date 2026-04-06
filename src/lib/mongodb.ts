import { Collection, MongoClient, ServerApiVersion, Document } from "mongodb";

const uri = process.env.MONGODB_URI!;
const databaseName = process.env.DATABASE_NAME!;

if (!uri) throw new Error("MONGODB_URI is not defined");
if (!databaseName) throw new Error("DATABASE_NAME is not defined");

// Global cache — dev mode এ hot reload এ নতুন connection এড়ায়
declare global {
  var _mongoClient: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Global cache for development mode to avoid creating new connections on hot reloads
const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === "development"
    ? (global._mongoClient ??= client.connect())
    : client.connect();

async function getCollection<T extends Document = Document>(
  collectionName: string,
): Promise<Collection<T>> {
  const connectedClient = await clientPromise;
  return connectedClient.db(databaseName).collection<T>(collectionName);
}

export { getCollection, client };