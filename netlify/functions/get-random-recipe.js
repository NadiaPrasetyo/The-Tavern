const {database} = require('./db');

// GET RANDOM RECIPE
const handler = async (req) => {
  try {
    const collection = database.collection('RecipeList'); // your recipe collection

    // Get a random recipe
    const count = await collection.countDocuments();
    const random = Math.floor(Math.random() * count);
    const recipe = await collection.find().limit(1).skip(random).toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ recipe: recipe }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };