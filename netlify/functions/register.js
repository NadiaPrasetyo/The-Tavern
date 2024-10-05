const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { database } = require("./db");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// User registration
const handler = async (req) => {
  const { username, name, email, password, confirmPassword } = JSON.parse(req.body);

  if (password !== confirmPassword) {
    return { statusCode: 400, body: JSON.stringify( { message: "Passwords do not match" }) };
  }
  if (password.length < 18 || password.length > 30) {
    return { statusCode: 400, body: JSON.stringify( { message: "Password must be between 18 and 30 characters" }) };
  }
  if (!username || !email || !name) {
    return { statusCode: 400, body: JSON.stringify( { message: "Please fill in all fields" }) };
  }
  if (!validateEmail(email)) {
    return { statusCode: 400, body: JSON.stringify( { message: "Please enter a valid email" }) };
  }

  try {
    const collection = database.collection("User");
    const existingUser = await collection.findOne({ username });
    const existingEmail = await collection.findOne({ email });

    if (existingUser || existingEmail) {
      return { statusCode: 400, body: JSON.stringify( { message: "Username or Email already exists" }) };
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await collection.insertOne({ name, username, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "1h" });
    return { statusCode: 200, body: JSON.stringify( { message: "Registration successful", token: token }) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler };
