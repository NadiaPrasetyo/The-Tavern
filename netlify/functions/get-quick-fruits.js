const {database} = require('./db');

// GET QUICK FRUITS
const handler = async (req) => {
    const {Username} = JSON.parse(req.body);
  try {
    const collection = database.collection('Inventory'); // your fruits collection

    // Get the fruits that are quick to prepare
    const fruits = await collection.find({Username: Username, Category: "Fruits"}).toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ fruits: fruits }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };