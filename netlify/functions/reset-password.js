const jwt = require('jsonwebtoken');
const { database } = require('./db');
const { ObjectId } = require('mongodb');
const argon2 = require('argon2');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// RESET PASSWORD
const handler = async (req) => {
    const { token, password } = JSON.parse(req.body);

    try {
        if (!token) {
            return { statusCode: 400, body: JSON.stringify({ message: "Invalid Link" }) };
        }
        if (!password) {
            return { statusCode: 400, body: JSON.stringify({ message: "Password is required" }) };
        }
        if (password.length < 18 || password.length > 30) {
            return { statusCode: 400, body: JSON.stringify( { message: "Password must be between 18 and 30 characters" }) };
        }

        // Verify token and handle expiration
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return reject({ statusCode: 400, message: "Link has expired, try sending another reset email" });
                    } else {
                        return reject({ statusCode: 400, message: "Invalid token" });
                    }
                } else {
                    resolve(decoded);
                }
            });
        });

        const collection = database.collection('User'); // your users collection
        
        const user = await collection.findOne({ _id: new ObjectId(decoded.id) });
        
        if (!user) {
            return { statusCode: 404, body: JSON.stringify({ message: "User not found." }) };
        }

        if (token !== user.resetPasswordToken) {
            return { statusCode: 401, body: JSON.stringify({ message: "New link has been issued, check your email" }) };
        }

        if (user.resetPasswordTokenUsed) {
            return { statusCode: 402, body: JSON.stringify({ message: "Link has already been used." }) };
        }


        const hashedPassword = await argon2.hash(password);
        await collection.updateOne({ username: user.username }, 
            { $set: { password: hashedPassword,
                resetPasswordTokenUsed: true
            } });

        return { statusCode: 200, body: JSON.stringify({ message: "Password reset successfully." }) };
    } catch (error) {
        if (error.statusCode) {
            return { statusCode: error.statusCode, body: JSON.stringify({ message: error.message }) };
        }

        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}


module.exports = { handler };