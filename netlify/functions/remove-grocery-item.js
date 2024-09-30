const {database} = require('./db');

// REMOVE GROCERY ITEM
const handler = async (req) => {
    const {Username, Name, Category} = JSON.parse(req.body);
  try {
    
    const collection = database.collection('GroceryList'); // your grocery collection

    // Remove the item from the grocery list
    await collection.deleteOne({ Username: Username, Name: Name, Category: Category });

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ message: "Item removed from grocery list" }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };