const {database} = require('./db');

// ADD TO INVENTORY
const handler = async (req) => {
    const {Username, Name} = JSON.parse(req.body);
  try {
    
    const collection = database.collection('Inventory'); // your inventory collection

    //check that the collection doesn't already have the item
    const item = await collection.findOne({ Username: Username, Name: Name });
    if (item) {
      return { statusCode: 409, body: JSON.stringify({ message: "Item already exist" }) };
    }

    // Add the item to the inventory
    await collection.insertOne(req.body);
    // console.log(req.body);

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ message: "Item added to inventory" }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };