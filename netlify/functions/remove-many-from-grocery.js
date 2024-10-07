const e = require('express');
const { database } = require('./db');

// ADD MANY TO GROCERY LIST
const handler = async (req) => {
    const { Username, Items } = JSON.parse(req.body);
    
    try {
        const collection = database.collection('GroceryList'); // your grocery collection
        
        // Create an array of promises for inserting each item
        const deletePromises = Items.map(async (item) => {
            // Check if the item already exists
            const itemExist = await collection.findOne({ Username, Name: item });

            if (itemExist) {
                // Add the item to the grocery list
                return collection.deleteOne({ Username, Name: item });
            } else {
                console.log(item, "does not exist in the grocery list");
            }
        });

        // Wait for all promises to resolve
        await Promise.all(deletePromises);

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ message: "Items removed from grocery list" }) };
    
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };
