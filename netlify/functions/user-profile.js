const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { database } = require("./db");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Get user profile
const handler = async (req) => {
  const token = req.headers["authorization"];
  if (!token) {
    return { statusCode: 403, body: JSON.stringify( { message: "No token provided" } )};
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return { statusCode: 500, body: JSON.stringify( { message: "Failed to authenticate token" }) };
    }

    try {
      const user = await database.collection("User").findOne({ _id: new ObjectId(decoded.id) });
      if (!user) {
        return { statusCode: 404, body: JSON.stringify( { message: "User not found" } )};
      }

      return { statusCode: 200, body: JSON.stringify( { username: user.username, email: user.email, name: user.name } )};
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify( { message: "Error fetching user profile" } )};
    }
  });
}

module.exports = { handler };
