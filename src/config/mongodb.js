import { MongoClient } from "mongodb";

const url = process.env.DB_URL;

let client;

export const connectToMongoDB = () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("MongoDB is connected");
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((err) => console.log(err));
};

export const getClient = () => client;

export const getDB = () => client.db();

const createCounter = async (db) => {
  const existingCounter = await db
    .collection("counters")
    .findOne({ _id: "cartItemId" });

  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: "cartItemId", value: 0 });
  }
};

const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 });
    await db.collection("products").createIndex({ name: 1, category: -1 });
    await db.collection("products").createIndex({ desc: "text" });
  } catch (error) {
    console.log(error);
  }
  console.log("Indexes are created.");
};
