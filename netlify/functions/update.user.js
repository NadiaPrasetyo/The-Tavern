const { database } = require("./db");


// Change password
const handler = async (req) => {
    const { username, name, email } = JSON.parse(req.body);

    try {
     
      const collection = database.collection('User'); // your users collection
  
      // Update the user in the database
      await collection.updateOne({ username }, { $set: { name, email } });
  
      // If everything is OK
      return { statusCode: 200, body: JSON.stringify( { message: "User updated successfully" }) };
  
    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler };
