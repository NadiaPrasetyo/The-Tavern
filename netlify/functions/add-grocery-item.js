const {database} = require('./db');


// ADD GROCERY ITEM
const handler = async (req) => {
    const {Username, Name} = JSON.parse(req.body);
  try {
   
    const collection = database.collection('GroceryList'); // your grocery collection

    //check that the collection doesn't already have the item
    const item = await collection.findOne({ Username: Username, Name: Name });
    if (item) {
      return { statusCode: 409, body: JSON.stringify({ message: "Item already exist" }) };
    }

    const empty = await collection.findOne({ Username: Username, Name: '' });
    if (empty) {
      await collection.deleteOne({ Username: Username, Name: '' });
    }

    // Add the item to the grocery list
    await collection.insertOne(JSON.parse(req.body));
    // console.log(JSON.parse(req.body));

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ message: "Item added to grocery list" }) };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
  }
}

module.exports = { handler };