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
const Recipe = database.collection("RecipeList");

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
  const { username, name, email, password, confirmPassword } = req.body;

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

// C`HAN`GE PASSWORD

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
      .find({ Username: username, Day: day_string })
      .toArray();

    // If everything is OK
    res.status(200).json({ menu: menu });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
);

// GET 5 LATEST GROCERY LIST
app.post('/api/get-5-last-grocery-list', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('GroceryList'); // your grocery collection

    // Find the 5 latest grocery list
    const grocery = await collection
      .find({ Username: req.body.username })
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    // If everything is OK
    res.status(200).json({ grocery: grocery });


  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//ADD 1 item to grocery list
app.post('/api/add-grocery-item', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('GroceryList'); // your grocery collection

    //check that the collection doesn't already have the item
    const item = await collection.findOne({ Username: req.body.Username, Name: req.body.Name });
    if (item) {
      return res.status(409).json({ message: "Item already exist" });
    }

    // Add the item to the grocery list
    await collection.insertOne(req.body);
    // console.log(req.body);

    // If everything is OK
    res.status(200).json({ message: "Item added to grocery list" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//ADD 1 item to inventory
app.post('/api/add-to-inventory', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('Inventory'); // your inventory collection

    //check that the collection doesn't already have the item
    const item = await collection.findOne({ Username: req.body.Username, Name: req.body.Name });
    if (item) {
      return res.status(409).json({ message: "Item already exist" });
    }

    // Add the item to the inventory
    await collection.insertOne(req.body);
    // console.log(req.body);

    // If everything is OK
    res.status(200).json({ message: "Item added to inventory" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//REMOVE 1 item from grocery list
app.post('/api/remove-grocery-item', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('GroceryList'); // your grocery collection

    // Remove the item from the grocery list
    await collection.deleteOne(req.body);
    // console.log(req.body);

    // If everything is OK
    res.status(200).json({ message: "Item removed from grocery list" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//GET RANDOM RECIPE
app.get('/api/get-random-recipe', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('RecipeList'); // your recipe collection

    // Find a random recipe
    const recipe = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();

    // If everything is OK
    res.status(200).json({ recipe: recipe });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//GET QUICK FRUITS
app.post('/api/get-quick-fruits', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('Inventory'); // your quick fruits collection

    // Find the quick fruits
    const fruits = await collection
      .find({ Username: req.body.Username, Category: "Fruits" })
      .toArray();

    // If everything is OK
    res.status(200).json({ fruits: fruits });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//GET QUICK VEGETABLES
app.post('/api/get-quick-vegetables', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('Inventory'); // your quick vegetables collection

    // Find the quick vegetables
    const vegetables = await collection
      .find({ Username: req.body.Username, Category: "Vegetables" })
      .toArray();

    // If everything is OK
    res.status(200).json({ vegetables: vegetables });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//GET RECIPE BY NAME
app.post('/api/find-recipe', async (req, res) => {
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('RecipeList'); // your recipe collection

    // Find the recipe by name
    const recipe = await collection
      .find({ Name: req.body.Name })
      .toArray();

    // If everything is OK
    res.status(200).json({ recipe: recipe });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// POST RECIPES BY NAME AND FILTER
app.post('/api/recipes', async (req, res) => {
  const { page = 1, limit = 10, search = '', includeT = [], excludeT = [], includeI = [], excludeI = [] } = req.body;
  const skip = (page - 1) * limit;

  try {
    // Create a case-insensitive regex to search by recipe name
    const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive

    // Build the query object with search and filters
    const query = {
      Name: { $regex: searchRegex }, // Search by name
    };

    // Use $and to combine multiple filter conditions
    const andConditions = [];

    // Include tags and ingredients
    if (includeT.length > 0) {
      andConditions.push({ Tag: { $all: includeT } }); // Include tags
    }

    if (includeI.length > 0) {
      andConditions.push({ Ingredients: { $all: includeI } }); // Include ingredients
    }

    // Exclude tags and ingredients
    if (excludeT.length > 0) {
      andConditions.push({ Tag: { $nin: excludeT } }); // Exclude tags
    }

    if (excludeI.length > 0) {
      andConditions.push({ Ingredients: { $nin: excludeI } }); // Exclude ingredients
    }

    // If there are any conditions, add them to the query
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Fetch filtered recipes based on the search query and filters, then apply pagination
    let recipes_all = Recipe.find(query); // Search by name and filters

    let length = await Recipe.countDocuments(query); // Count filtered results

    // if there's no recipe found, try to search by tags
    if (length === 0) {
      const query = {
        Tag: { $regex: searchRegex }, // Search by tag
      };
      if (andConditions.length > 0) {
        query.$and = andConditions;
      }
      recipes_all = Recipe.find(query); // Search by tag
      length = await Recipe.countDocuments(query); // Count filtered results
      // if there's no recipe found, try to search by ingredients
      if (length === 0) {
        const query = {
          Ingredients: { $regex: searchRegex }, // Search by ingredients
        };
        if (andConditions.length > 0) {
          query.$and = andConditions;
        }
        recipes_all = Recipe.find(query); // Search by ingredients
      }
    }
    // Get paginated recipes
    const recipes = await recipes_all
      .skip(skip) // Skip previous pages
      .limit(limit) // Limit the number of results
      .toArray();

    // Get all tags and ingredients (before pagination)
    // Aggregation for distinct tags
    const recipe_tags = await Recipe.aggregate([
      { $match: Object.keys(query).length ? query : {} },
      { $unwind: "$Tag" },
      { $group: { _id: "$Tag" } },
      { $project: { Tag: "$_id", _id: 0 } }
    ]).toArray();

    // Convert recipe_tags array to a simple array of tag strings
    const formatted_tags = recipe_tags.map(tag => tag.Tag);

    // Aggregation for distinct ingredients
    const recipe_ingredients = await Recipe.aggregate([
      { $match: Object.keys(query).length ? query : {} },
      { $unwind: "$Ingredients" },
      { $group: { _id: "$Ingredients" } },
      { $project: { Ingredients: "$_id", _id: 0 } }
    ]).toArray();

    // Convert recipe_ingredients array to a simple array of ingredient strings
    const formatted_ingredients = recipe_ingredients.map(ingredient => ingredient.Ingredients);

    // Count total recipes
    const totalRecipes = await Recipe.countDocuments(query); // Count filtered results

    res.json({
      recipes, // Recipes for the current page
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit), // Total pages based on search result count
      tags: formatted_tags, // All tags matching the filtered query
      ingredients: formatted_ingredients, // All ingredients matching the filtered query
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err });
  }
});

// ADD RECIPE TO FAVORITE
app.post('/api/add-favorite-recipe', async (req, res) => {
  const { username, recipe, max_favourites } = req.body;

  try {
    const db = client.db('The-tavern');
    const collection = db.collection('Favourites'); // your favorite recipe collection

    //check that the collection doesn't already have the item
    const item = await collection.findOne({ Username: username, Name: recipe });
    if (item) {
      return res.status(409).json({ message: "Recipe already exist" });
    }

    // if user already have max_favourites amount of recipes
    const count = await collection.countDocuments({ Username: username });
    if (count >= max_favourites) {
      return res.status(409).json({ message: "You already have the maximum amount of favorite recipes" });
    }

    // Add the item to the favorite recipe
    await collection.insertOne({ Username: username, Name: recipe });
    // console.log(req.body);

    // If everything is OK
    res.status(200).json({ message: "Recipe added to favorite" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// REMOVE RECIPE FROM FAVORITE (DELETE REQUEST)
app.delete('/api/remove-favorite-recipe', async (req, res) => {
  const { username, recipe } = req.body;
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('Favourites'); // your favorite recipe collection

    // Check if the recipe exists
    const item = await collection.findOne({ Username: username, Name: recipe });
    if (!item) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Remove the item from the favorite recipe
    await collection.deleteOne({ Username: username, Name: recipe });
    // console.log(req.body);

    // If everything is OK
    res.status(200).json({ message: "Recipe removed from favorite" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET FAVORITE RECIPES
app.get('/api/get-favorite-recipes', async (req, res) => {
  const { username } = req.query;
  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('Favourites'); // your favorite recipe collection

    // Find the favorite recipes
    const recipes = await collection
      .find({ Username: username })
      .toArray();

    // get the full recipe details
    const recipeList = [];
    for (const recipe of recipes) {
      const recipeDetails = await Recipe.findOne({ Name: recipe.Name });
      recipeList.push(recipeDetails);
    }

    // If everything is OK
    res.status(200).json({ favourites: recipeList });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET RECOMENDED RECIPES
app.post('/api/recommendation', async (req, res) => {
  const { username, page = 1, limit = 10, search = '', includeT = [], excludeT = [], includeI = [], excludeI = [] } = req.body;
  const skip = (page - 1) * limit;

  try {
    const userInventories = await database.collection('Inventory').find({ Username: username }).toArray();
    const userInventory = userInventories.map(inventory => inventory.Name);

    // if user has no inventory, return empty array
    if (userInventory.length === 0) {
      return res.json({
        recipes: [], // Empty array
        currentPage: page,
        totalPages: 1, // only 1 page
        tags: [], // Empty array
        ingredients: [], // Empty array
        message: "No inventory found, please initialise your inventory first."
      });
    }

    // Create a case-insensitive regex to search by recipe name
    const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive

    // Build the query object with search and filters
    const query = {
      Name: { $regex: searchRegex }, // Search by name
    };

    // Use $and to combine multiple filter conditions
    const andConditions = [];

    // Include tags and ingredients
    if (includeT.length > 0) {
      andConditions.push({ Tag: { $all: includeT } }); // Include tags
    }

    if (includeI.length > 0) {
      andConditions.push({ Ingredients: { $all: includeI } }); // Include ingredients
    }

    // Exclude tags and ingredients
    if (excludeT.length > 0) {
      andConditions.push({ Tag: { $nin: excludeT } }); // Exclude tags
    }

    if (excludeI.length > 0) {
      andConditions.push({ Ingredients: { $nin: excludeI } }); // Exclude ingredients
    }

    // If there are any conditions, add them to the query
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }


    // Use aggregation to find recipes and match the user's inventory with recipe ingredients
    const recipes_all = await Recipe.aggregate([
      { $match: query },
      {
        $addFields: {
          matchedIngredients: {
            $size: {
              $filter: {
                input: "$Ingredients",
                as: "ingredient",
                cond: { $in: ["$$ingredient", userInventory] } // Match user's inventory with recipe ingredients
              }
            }
          }
        }
      },
      { $match: { matchedIngredients: { $gt: 0 } } }, // Ensure at least one matching ingredient
      { $sort: { matchedIngredients: -1 } }, // Sort by the number of matched ingredients (descending)
      { $skip: skip }, // Skip previous pages
      { $limit: limit } // Limit the number of results
    ]).toArray();

    // Count total recipes matching the user's inventory
    const totalRecipes = await Recipe.aggregate([
      { $match: query },
      {
        $addFields: {
          matchedIngredients: {
            $size: {
              $filter: {
                input: "$Ingredients",
                as: "ingredient",
                cond: { $in: ["$$ingredient", userInventory] }
              }
            }
          }
        }
      },
      { $match: { matchedIngredients: { $gt: 0 } } }, // Ensure at least one matching ingredient
      { $count: "total" }
    ]).toArray();

    const total = totalRecipes.length > 0 ? totalRecipes[0].total : 0;

    if (total === 0) {
      return res.json({
        recipes: [], // Empty array
        currentPage: page,
        totalPages: 1, // only 1 page
        tags: [], // Empty array
        ingredients: [], // Empty array
        message: "No recipes found matching your inventory."
      });
    }

    // Get all tags and ingredients (before pagination)
    const recipe_tags = await Recipe.aggregate([
      { $match: Object.keys(query).length ? query : {} },
      { $unwind: "$Tag" },
      { $group: { _id: "$Tag" } },
      { $project: { Tag: "$_id", _id: 0 } }
    ]).toArray();

    const formatted_tags = recipe_tags.map(tag => tag.Tag);

    const recipe_ingredients = await Recipe.aggregate([
      { $match: Object.keys(query).length ? query : {} },
      { $unwind: "$Ingredients" },
      { $group: { _id: "$Ingredients" } },
      { $project: { Ingredients: "$_id", _id: 0 } }
    ]).toArray();

    const formatted_ingredients = recipe_ingredients.map(ingredient => ingredient.Ingredients);

    res.json({
      recipes: recipes_all, // Recipes for the current page
      currentPage: page,
      totalPages: Math.ceil(total / limit), // Total pages based on matching result count
      tags: formatted_tags, // All tags matching the filtered query
      ingredients: formatted_ingredients, // All ingredients matching the filtered query
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err });
  }
});

// GET MENU FOR THE WEEK

app.get('/api/get-menu', async (req, res) => {
  const { username } = req.query;

  try {
    const db = client.db('The-tavern'); // replace with your DB name
    const collection = db.collection('Menu'); // your menu collection
    const recipeCollection = db.collection('RecipeList'); // your recipe collection

    // get the recipes names per day
    const monday = await collection
      .find({ Username: username, Day: "Monday" },
        { Name: 1, _id: 0 })
      .toArray();

    const mondayRecipes = [];
    for (const recipe of monday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      mondayRecipes.push(recipeDetails);
    }

    const tuesday = await collection
      .find({ Username: username, Day: "Tuesday" },
        { Name: 1, _id: 0 })
      .toArray();

    const tuesdayRecipes = [];
    for (const recipe of tuesday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      tuesdayRecipes.push(recipeDetails);
    }

    const wednesday = await collection
      .find({ Username: username, Day: "Wednesday" },
        { Name: 1, _id: 0 })
      .toArray();

    const wednesdayRecipes = [];
    for (const recipe of wednesday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      wednesdayRecipes.push(recipeDetails);
    }

    const thursday = await collection
      .find({ Username: username, Day: "Thursday" },
        { Name: 1, _id: 0 })
      .toArray();

    const thursdayRecipes = [];
    for (const recipe of thursday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      thursdayRecipes.push(recipeDetails);
    }

    const friday = await collection
      .find({ Username: username, Day: "Friday" },
        { Name: 1, _id: 0 })
      .toArray();

    const fridayRecipes = [];
    for (const recipe of friday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      fridayRecipes.push(recipeDetails);
    }

    const saturday = await collection
      .find({ Username: username, Day: "Saturday" },
        { Name: 1, _id: 0 })
      .toArray();

    const saturdayRecipes = [];
    for (const recipe of saturday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      saturdayRecipes.push(recipeDetails);
    }

    const sunday = await collection
      .find({ Username: username, Day: "Sunday" },
        { Name: 1, _id: 0 })
      .toArray();

    const sundayRecipes = [];
    for (const recipe of sunday) {
      const recipeDetails = await recipeCollection.findOne({ Name: recipe.Name });
      sundayRecipes.push(recipeDetails);
    }

    // If everything is OK
    res.status(200).json({
      Monday: mondayRecipes,
      Tuesday: tuesdayRecipes,
      Wednesday: wednesdayRecipes,
      Thursday: thursdayRecipes,
      Friday: fridayRecipes,
      Saturday: saturdayRecipes,
      Sunday: sundayRecipes
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});