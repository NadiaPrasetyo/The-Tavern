const {database} = require('./db');

// FIND RECIPE BY NAME
const handler = async (req) => {
    const {Name} = JSON.parse(req.body);
    try {
        const collection = database.collection('RecipeList'); // your recipe collection

        // Find the recipe by name
        const recipe = await collection.find({ Name: Name }).toArray();

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ recipe: recipe }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };