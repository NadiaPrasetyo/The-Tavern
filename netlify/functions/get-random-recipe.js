const { database } = require('./db');

// GET RANDOM RECIPE
const handler = async (req) => {
  try {
    const collection = database.collection('RecipeList'); // your recipe collection

    // Exclude recipes from any source that contains 'preppykitchen.com'
    const filter = { source: { $not: { $regex: 'preppykitchen\\.com', $options: 'i' } } };

    // Get the count of documents excluding preppykitchen recipes
    const count = await collection.countDocuments(filter);

    if (count === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "No recipes found" }) };
    }

    // Generate a random index and get a random recipe that does not come from preppykitchen
    const random = Math.floor(Math.random() * count);
    const recipe = await collection.find(filter).limit(1).skip(random).toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ recipe: recipe }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
};

module.exports = { handler };
