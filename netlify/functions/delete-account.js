const {database} = require('./db');

// DELETE ACCOUNT
const handler = async (req) => {
    const { username } = JSON.parse(req.body);
    try {
        const GroceryList = database.collection('GroceryList'); // your grocery collection
        const Inventory = database.collection('Inventory'); // your inventory collection
        const Menu = database.collection('Menu'); // your menu collection
        const Favorites = database.collection('Favourites'); // your favorite collection
        const Preferences = database.collection('Preferences'); // your preferences collection
        const User = database.collection('User'); // your users collection

        // Delete the data
        await Promise.all([
            GroceryList.deleteMany({ Username: username }),
            Inventory.deleteMany({ Username: username }),
            Menu.deleteMany({ Username: username }),
            Favorites.deleteMany({ Username: username }),
            Preferences.deleteMany({ Username: username }),
            User.deleteOne({ username })
        ]);

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({ message: "Account deleted successfully" })};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};