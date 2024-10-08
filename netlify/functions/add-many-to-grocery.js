const { database } = require('./db');

// ADD MANY TO GROCERY LIST
const handler = async (req) => {
    const { Username, Items, Category } = JSON.parse(req.body);
    
    try {
        const collection = database.collection('GroceryList'); // your grocery collection
        
        // Create an array of promises for inserting each item
        const insertPromises = Items.map(async (item) => {
            // Check if the item already exists
            const itemExist = await collection.findOne({ Username, Name: item });

            if (itemExist) {
                console.log(itemExist.Name, "already exists in the grocery list in category:", itemExist.Category);
            } else {
                // Add the item to the grocery list
                return collection.insertOne({ Username, Name: item, Category });
            }
        });

        // Wait for all promises to resolve
        await Promise.all(insertPromises);

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ message: "Items added to grocery list" }) };
    
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };
