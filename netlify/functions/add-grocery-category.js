const {database} = require('./db');

// ADD GROCERY CATEGORY
const handler = async (req) => {
    const {Username, Category} = JSON.parse(req.body);
    try {
        const collection = database.collection('GroceryList'); // your inventory collection

        //check that the collection doesn't already have the item
        const item = await collection.findOne({ Username, Category });

        if (item) {
            return {statusCode: 409, body: JSON.stringify({message: "Category already exist"})};
        }

        // Add the item to the inventory
        await collection.insertOne(JSON.parse(req.body));

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({message: "Category added to grocery"})};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({message: "Server error"})};
    }
}

module.exports = {handler};