const {database} = require('./db');

// UPDATE GROCERY ITEM
const handler = async (req) => {
    const { Username, Name, Category, NewName, NewCategory } = JSON.parse(req.body); // Extracting new values

    console.log("Updating item with Username:", Username, "Name:", Name, "Category:", Category);

    try {
        const collection = database.collection('GroceryList'); // your inventory collection

        // Update item by Username and Name (could add Category here if required)
        const updateResult = await collection.updateOne(
            { Username, Name, Category },  // Find the item based on Username, Name, and Category
            {
                $set: {
                    Name: NewName || Name,       // Update the Name field
                    Category: NewCategory || Category  // Update the Category field
                }
            }
        );

        if (updateResult.modifiedCount === 0) {
            console.log("No documents were updated. Check if the item exists.");
            return {statusCode: 404, body: JSON.stringify({ message: "Item not found or no changes made" })};
        }

        return {statusCode: 200, body: JSON.stringify({ message: "Item updated successfully" })};

    } catch (error) {
        console.error("Error updating item:", error);
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};