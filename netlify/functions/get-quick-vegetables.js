const {database} = require('./db');

// GET QUICK VEGETABLES
const handler = async (req) => {
    const {Username} = JSON.parse(req.body);
    try {
     
      const collection = database.collection('Inventory'); // your quick vegetables collection
  
      // Find the quick vegetables
      const vegetables = await collection
        .find({ Username: Username, Category: "Vegetables" })
        .toArray();
  
      // If everything is OK
      return { statusCode: 200, body: JSON.stringify({ vegetables: vegetables }) };
  
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
  }

module.exports = { handler };