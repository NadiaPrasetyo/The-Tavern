const {database} = require('./db');
// ADD RECIPE
const handler = async (req) => {
  try {
    const collection = database.collection('RecipeList'); // your recipes collection
    await collection.insertOne(JSON.parse(req.body));
    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ message: "Recipe added successfully" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  } 
}

module.exports = { handler };