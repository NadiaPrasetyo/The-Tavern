const {database} = require('./db');


// GET GROCERY LIST
const handler = async (req) => {
    try {
        const collection = database.collection('GroceryList'); // your grocery collection

        // Find the grocery list
        const grocery = await collection
            .find({ Username: req.body.Username })
            .toArray();

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({ grocery: grocery })};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};