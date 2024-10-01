const {database} = require('./db');

// Get inventory
const handler = async (req) => {
    const { Username } = JSON.parse(req.body); // Extract username from query params
  
    try {
        const collection = database.collection('Inventory'); // your inventory collection
  
        // Find the inventory
        const inventory = await collection
            .find({ Username: Username })
            .toArray();
  
        //console.log(inventory);
  
        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ inventory: inventory }) };
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler };