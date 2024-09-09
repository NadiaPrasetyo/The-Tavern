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
const argon2 = require('argon2');
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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true // Explicitly enable SSL
  }
});

async function connectToDb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
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
      // const hashedPassword = await argon2.hash(password); // Hash the password

      // console.log("hashedPassword: ", hashedPassword);

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
  
      // If everything is OK, return username, name, and email
      res.status(200).json({ message: "Login successful", username: user.username, name: user.name, email: user.email });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

// USER REGISTER

  app.post('/api/register', async (req, res) => {
    const { username, name, email, password, confirmPassword} = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // Password validation between 18 to 30 characters
    if (password.length < 18 || password.length > 30) {
      return res.status(400).json({ message: "Password must be between 18 and 30 characters" });
    }

    // Username, email, and name cannot be empty
    if (!username || !email || !name) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
      const hashedPassword = await argon2.hash(password); // Hash the password

      // console.log("hashedPassword: ", hashedPassword);

      const db = client.db('The-tavern'); // replace with your DB name
      const collection = db.collection('User'); // your users collection
  
      // Check if username already exists
      const user = await collection.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "Username already exist" });
      }
      // Check if email already exists
      const emailExist = await collection.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ message: "Email already exist" });
      }
      
      // Insert the user into the database
      await collection.insertOne({ name: name, username: username, email: email, password: hashedPassword });

      // If everything is OK
      res.status(200).json({ message: "Register successful" });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // CHANGE PASSWORD

  app.post('/api/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
  
    // Password validation between 18 to 30 characters
    if (newPassword.length < 18 || newPassword.length > 30) {
      return res.status(400).json({ message: "Password must be between 18 and 30 characters" });
    }

    try {
      const db = client.db('The-tavern'); // replace with your DB name
      const collection = db.collection('User'); // your users collection
  
      // Find user by username
      const user = await collection.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Verify the password using argon2.verify()
      const isMatch = await argon2.verify(user.password, currentPassword); // password is the hashed password from React
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Hash the new password
      const hashedPassword = await argon2.hash(newPassword);
  
      // Update the password in the database
      await collection.updateOne({ username }, { $set: { password: hashedPassword } });
  
      // If everything is OK
      res.status(200).json({ message: "", changed: true });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // UPDATE USER

  app.post('/api/update-user', async (req, res) => {
    const { username, name, email } = req.body;
  
    try {
      const db = client.db('The-tavern'); // replace with your DB name
      const collection = db.collection('User'); // your users collection
  
      // Update the user in the database
      await collection.updateOne({ username }, { $set: { name, email } });
  
      // If everything is OK
      res.status(200).json({ message: "User updated successfully" });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET MENU TODAY
  app.post('/api/get-menu-today', async (req, res) => {
    try {
      const db = client.db('The-tavern'); // replace with your DB name
      const collection = db.collection('Menu'); // your menu collection
      
      // Find the menu for today
      //check day of the week
      const today = new Date();
      const day = today.getDay();
      let day_string = "";
      switch (day) {
        case 0:
          day_string = "Sunday";
          break;
        case 1:
          day_string = "Monday";
          break;
        case 2:
          day_string = "Tuesday";
          break;
        case 3:
          day_string = "Wednesday";
          break;
        case 4:
          day_string = "Thursday";
          break;
        case 5:
          day_string = "Friday";
          break;
        case 6:
          day_string = "Saturday";
          break;
      }

       //check username
       const username = req.body.username;
      
      const menu = await collection
        .find({Username: username, Day: day_string})
        .toArray();
  
      // If everything is OK
      res.status(200).json({ menu:menu });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  );

  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });