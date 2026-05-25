import mongoose from "mongoose";

type MongooseConnectionCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseConnectionCache: MongooseConnectionCache | undefined;
}

const cached = globalThis.mongooseConnectionCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseConnectionCache) {
  globalThis.mongooseConnectionCache = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectToDatabase;
