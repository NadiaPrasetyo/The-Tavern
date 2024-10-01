const {database} = require('./db');

// ADD MANY TO GROCERY LIST
const handler = async (req) => {
    const { Username, Items, Category } = JSON.parse(req.body);
    
    try {
        const collection = database.collection('GroceryList'); // your grocery collection
    
        Items.map(async item => {
            //check that the collection doesn't already have the item
            const itemExist = await collection.findOne({ Username, Name: item });
    
            if (itemExist) {
                // skip the item if it already exists
                console.log(itemExist.Name, "already exists in the grocery list in category:", itemExist.Category);
            } else {
                // Add the item to the grocery list
                await collection.insertOne({ Username, Name: item, Category });
            }
        });
    
        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({ message: "Items added to grocery list" })};
    
    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};