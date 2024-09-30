const {database} = require('./db');

// UPDATE MENU
const handler = async (req) => {
    const { username, menu } = JSON.parse(req.body);
    // console.log("Updating menu for user:", username);
    try {
     
        const collection = database.collection('Menu'); // your menu collection
    
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
        // get the names of the recipes for each day
        const [monday, tuesday, wednesday, thursday, friday, saturday, sunday] = days.map(day => {
        return menu[day].map(recipe => recipe.Name);
        });
        await Promise.all([
        collection.deleteMany({ Username: username, Day: "Monday" }).then(() => {
            if (monday.length > 0) {
            return collection.insertMany(monday.map(recipe => ({ Username: username, Day: "Monday", Name: recipe })));
            }
        }),
        collection.deleteMany({ Username: username, Day: "Tuesday" }).then(() => {
            if (tuesday.length > 0) {
            return collection.insertMany(tuesday.map(recipe => ({ Username: username, Day: "Tuesday", Name: recipe })));
            }
        }),
        collection.deleteMany({ Username: username, Day: "Wednesday" }).then(() => {
            if (wednesday.length > 0) {
            return collection.insertMany(wednesday.map(recipe => ({ Username: username, Day: "Wednesday", Name: recipe })));
            }
        }),
        collection.deleteMany({ Username: username, Day: "Thursday" }).then(() => {
            if (thursday.length > 0) {
            return collection.insertMany(thursday.map(recipe => ({ Username: username, Day: "Thursday", Name: recipe })));
            }
        }),
        collection.deleteMany({ Username: username, Day: "Friday" }).then(() => {
            if (friday.length > 0) {
            return collection.insertMany(friday.map(recipe => ({ Username: username, Day: "Friday", Name: recipe })));
            }
        }),
        collection.deleteMany({ Username: username, Day: "Saturday" }).then(() => {
            if (saturday.length > 0) {
            return collection.insertMany(saturday.map(recipe => ({ Username: username, Day: "Saturday", Name: recipe })));
            }
        }),
        collection.deleteMany({ Username: username, Day: "Sunday" }).then(() => {
            if (sunday.length > 0) {
            return collection.insertMany(sunday.map(recipe => ({ Username: username, Day: "Sunday", Name: recipe })));
            }
        })
        ]);
        // console.log("Menu updated successfully");

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ message: "Menu updated successfully" }) }; 
    } catch (error) {
        console.error("Error updating menu:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };