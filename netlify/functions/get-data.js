const {database} = require('./db');

// GET DATA
const handler = async (req) => {
    const { Username } = JSON.parse(req.body);
    try {
        const GroceryList = database.collection('GroceryList'); // your grocery collection
        const Inventory = database.collection('Inventory'); // your inventory collection
        const Menu = database.collection('Menu'); // your menu collection
        const Favorites = database.collection('Favourites'); // your favorite collection

        // Find the data
        const [grocery, inventory, menu, favorites] = await Promise.all([
            GroceryList.find({ Username }).toArray(),
            Inventory.find({ Username }).toArray(),
            Menu.find({ Username }).toArray(),
            Favorites.find({ Username }).toArray()
        ]);

        // filter the data (remove Username)
        const data = {
            grocery: grocery.map(item => ({ Name: item.Name, Category: item.Category })),
            inventory: inventory.map(item => ({ Name: item.Name, Category: item.Category })),
            menu: menu.map(item => ({ Day: item.Day, Name: item.Name })),
            favorites: favorites.map(item => ({ Name: item.Name }))
        };

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({ data: data })};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};