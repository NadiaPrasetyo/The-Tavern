const {database} = require('./db');

// ADD FAVORITE RECIPE
const handler = async (req) => {
    const {Username, Name, max_favourites} = JSON.parse(req.body);
    try {
        const collection = database.collection('Favourites'); // your favorite recipe collection

        //check that the collection doesn't already have the item
        const item = await collection.findOne({ Username: Username, Name: Name });
        if (item) {
            return { statusCode: 409, body: JSON.stringify({ message: "Recipe already exist" }) };
        }

        // if user already have max_favourites amount of recipes
        const count = await collection.countDocuments({ Username: Username });
        if (count >= max_favourites) {
            return { statusCode: 409, body: JSON.stringify({ message: "You already have the maximum amount of favorite recipes" }) };
        }

        // Add the item to the favorite recipe
        await collection.insertOne({ Username: Username, Name: Name });

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ message: "Recipe added to favorite" }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };