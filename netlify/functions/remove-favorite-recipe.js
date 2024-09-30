const {database} = require('./db');

// REMOVE FAVORITE RECIPE
const handler = async (req) => {
    const {Username, Name} = JSON.parse(req.body);
    try {
        const collection = database.collection('Favourites'); // your favorite recipe collection

        // Check if the recipe exists
        const item = await collection.findOne({ Username: Username, Name: Name });
        if (!item) {
            return { statusCode: 404, body: JSON.stringify({ message: "Recipe not found" }) };
        }

        // Remove the item from the favorite recipe
        await collection.deleteOne({ Username: Username, Name: Name });

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ message: "Recipe removed from favorite" }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };