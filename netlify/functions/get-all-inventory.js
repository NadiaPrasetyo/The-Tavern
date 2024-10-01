const {database} = require('./db');

// GET ALL INVENTORY ITEMS
const handler = async (req) => {
    const { username } = req.query;
    try {
        const collection = database.collection('Inventory'); // your inventory collection

        // Find all inventory names of user
        const inventory = await collection
            .find({ Username: username }, { Name: 1, _id: 0 })
            .toArray().then((data) => {
                return data.map((item) => item.Name);
            });

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ inventory: inventory }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };