const {database} = require('./db');

// GET ALL GROCERY ITEMS
const handler = async (req) => {
    const { username } = req.queryStringParameters;
    try {
        const collection = database.collection('GroceryList'); // your grocery collection

        // Find all grocery names of user
        const grocery = await collection
            .find({ Username: username }, { Name: 1, _id: 0 })
            .toArray().then((data) => {
                return data.map((item) => item.Name);
            });

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ grocery: grocery }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = {handler};