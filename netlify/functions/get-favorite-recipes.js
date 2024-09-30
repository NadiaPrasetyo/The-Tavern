const {database} = require('./db');

// GET FAVORITE RECIPES
const handler = async (req) => {
  const { username } = JSON.parse(req.body);
  try {
   
    const collection = database.collection('Favourites'); // your favorite recipe collection

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
    return { statusCode: 200, body: JSON.stringify({ favourites: recipeList }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };