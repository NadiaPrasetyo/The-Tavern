const { database } = require('./db');

// GET RANDOM RECIPE
const handler = async (req) => {
  try {
    const collection = database.collection('RecipeList'); // your recipe collection

    // get the number of documents in the collection
    const count = await collection.countDocuments();

    if (count === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "No recipes found" }) };
    }

    // Generate a random index and get a random recipe 
    const random = Math.floor(Math.random() * count);
    const recipe = await collection.find().limit(1).skip(random).toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ recipe: recipe }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
};

module.exports = { handler };
