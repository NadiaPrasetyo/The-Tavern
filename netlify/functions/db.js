const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI; // Netlify will handle loading environment variables
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  },
});

async function connectToDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

const database = client.db("The-tavern");
module.exports = { database, connectToDb, client };
