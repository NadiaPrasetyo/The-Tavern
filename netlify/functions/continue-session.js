const jwt = require("jsonwebtoken");
const { database } = require("./db");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// User login
const handler = async (req) => {
  const { username } = JSON.parse(req.body);
  try {
    const collection = database.collection("User");
    const user = await collection.findOne({ username });
    if (!user) {
      return { statusCode: 400, body: JSON.stringify({ message: "User not found" } )};
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    return { statusCode: 200, body: JSON.stringify({ message: "Login successful", token: token })};
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler };
