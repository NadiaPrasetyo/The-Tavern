const {database} = require('./db');

// UPDATE PREFERENCE
const handler = async (req) => {
    const { Username, Preferences } = JSON.parse(req.body);
    try {
        
        const collection = database.collection('Preferences'); // your preferences collection

        if (!Preferences || Object.keys(Preferences).length === 0) {
            await collection.deleteOne({ Username: Username });
        } else {
            // Update the preferences in the database    
            await collection.updateOne({ Username: Username }, { $set: Preferences }, { upsert: true });
        }
        
        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({ message: "Preferences updated successfully" })};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }
}

module.exports = {handler};