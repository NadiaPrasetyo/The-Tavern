const {database} = require('./db');

// GET PREFERENCE
const handler = async (req) => {
    const { Username } = req.queryStringParameters;
    console.log(Username);
    
    try {
        const collection = database.collection('Preferences'); // your preferences collection

        // Find the preferences
        const preferences = await collection
            .findOne({ Username: Username });

        if (!preferences) {
            return {statusCode: 200, body: JSON.stringify({ preferences: {}, message: "Use default preference" })};
        }

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({ preferences: preferences })};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};