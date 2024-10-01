const {database} = require('./db');

// REMOVE INVENTORY ITEM
const handler = async (req) => {
    try {
        const collection = database.collection('Inventory'); // your inventory collection

        // Remove the item from the inventory
        await collection.deleteOne(req.body);
        // console.log(req.body);

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({message: "Item removed from inventory"})};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({message: "Server error"})};
    }
}

module.exports = {handler};