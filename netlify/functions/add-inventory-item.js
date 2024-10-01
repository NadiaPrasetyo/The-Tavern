const {database} = require('./db');

const handler = async (req) => {
    const {Username, Category, Name} = JSON.parse(req.body);
    try {
        const collection = database.collection('Inventory'); // your inventory collection

        //check that the collection doesn't already have the item
        const item = await collection.findOne({ Username, Name });

        if (item != null) {
            // throw an error if the item already exists in the user's inventory
            return {statusCode: 409, body: JSON.stringify({message: "Item already exist"})};
        }

        //check that that the collection doesn't have an empty name item
        const item2 = await collection.findOne({ Username, Category, Name: "" });
        if (item2 != null) {
            //replace the empty name item with the new item
            await collection.updateOne({Username, Category, Name: ""}, {$set: JSON.parse(req.body)});
            return {statusCode: 200, body: JSON.stringify({message: "Item added to inventory"})};
        }

        // Add the item to the inventory
        await collection.insertOne(JSON.parse(req.body));
        // console.log(req.body);

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({message: "Item added to inventory"})};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({message: "Server error"})};
    }
}

module.exports = {handler};
