const {database} = require('./db');
// CLEAR MENU
const handler = async (req) => {
    const {username} = JSON.parse(req.body);
    try {
        const collection = database.collection('Menu'); // your menu collection
        await collection.deleteMany({ username: username });
        await collection.deleteMany({ Username: username });

        // If everything is OK
        return { statusCode: 200, body: JSON.stringify({ message: `${username}'s Menu cleared successfully` }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };