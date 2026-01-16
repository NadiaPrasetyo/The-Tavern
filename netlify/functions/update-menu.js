const {database} = require('./db');

// UPDATE MENU
const handler = async (req) => {
    const { username, menu } = JSON.parse(req.body);
    try {
        const collection = database.collection('Menu'); // your menu collection

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // get the IDs of the recipes for each day
        const [monday, tuesday, wednesday, thursday, friday, saturday, sunday] = days.map(day => {
            return menu[day].map(recipe => recipe._id);
        });

        await Promise.all([
            collection.deleteMany({ Username: username, Day: "Monday" }).then(() => {
                if (monday.length > 0) {
                    return collection.insertMany(monday.map(recipeId => ({ Username: username, Day: "Monday", RecipeId: recipeId })));
                }
            }),
            collection.deleteMany({ Username: username, Day: "Tuesday" }).then(() => {
                if (tuesday.length > 0) {
                    return collection.insertMany(tuesday.map(recipeId => ({ Username: username, Day: "Tuesday", RecipeId: recipeId })));
                }
            }),
            collection.deleteMany({ Username: username, Day: "Wednesday" }).then(() => {
                if (wednesday.length > 0) {
                    return collection.insertMany(wednesday.map(recipeId => ({ Username: username, Day: "Wednesday", RecipeId: recipeId })));
                }
            }),
            collection.deleteMany({ Username: username, Day: "Thursday" }).then(() => {
                if (thursday.length > 0) {
                    return collection.insertMany(thursday.map(recipeId => ({ Username: username, Day: "Thursday", RecipeId: recipeId })));
                }
            }),
            collection.deleteMany({ Username: username, Day: "Friday" }).then(() => {
                if (friday.length > 0) {
                    return collection.insertMany(friday.map(recipeId => ({ Username: username, Day: "Friday", RecipeId: recipeId })));
                }
            }),
            collection.deleteMany({ Username: username, Day: "Saturday" }).then(() => {
                if (saturday.length > 0) {
                    return collection.insertMany(saturday.map(recipeId => ({ Username: username, Day: "Saturday", RecipeId: recipeId })));
                }
            }),
            collection.deleteMany({ Username: username, Day: "Sunday" }).then(() => {
                if (sunday.length > 0) {
                    return collection.insertMany(sunday.map(recipeId => ({ Username: username, Day: "Sunday", RecipeId: recipeId })));
                }
            })
        ]);

        return { statusCode: 200, body: JSON.stringify({ message: "Menu updated successfully" }) }; 
    } catch (error) {
        console.error("Error updating menu:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };