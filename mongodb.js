// npm install mongodb argon2-browser express body-parser

const fs = require('fs');
const path = require('path');


// Load the .env file 
const envFilePath = path.resolve(__dirname, '.env'); 
if (fs.existsSync(envFilePath)) { 
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8'); 
    envFileContent.split('\n').forEach(line => { 
        const [key, ...values] = line.split('='); // Split only on the first '='
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim().replace(/(^"|"$)/g, ''); // Join the rest of the values
        }
    }); 
}

const express = require('express');
const argon2 = require('argon2-browser');
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;
const uri = process.env.MONGODB_URI;

// Use bodyParser to parse incoming requests
app.use(bodyParser.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
connectToDb().catch(console.dir);

const database = client.db("The-tavern");

async function listCollections(database){
    const collections = await database.listCollections().toArray();
 
    console.log("Collections:");
    collections.forEach(collection => console.log(` - ${collection.name}`));
};

listCollections(database).catch(console.dir);

// USER LOGIN

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const db = client.db('The-tavern'); // replace with your DB name
      const collection = db.collection('User'); // your users collection
  
      // Find user by username
      const user = await collection.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Verify the password using argon2.verify()
      const isMatch = await argon2.verify(user.password, password); // password is the hashed password from React
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // If everything is OK
      res.status(200).json({ message: "Login successful" });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });