const {database} = require('./db');

// GET 5 LATEST GROCERY LIST
const handler = async (req) => {
    const {Username} = JSON.parse(req.body);
  try {
   
    const collection = database.collection('GroceryList'); // your grocery collection

    // Find the 5 latest grocery list
    const grocery = await collection
      .find({ Username: Username })
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ grocery: grocery }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };