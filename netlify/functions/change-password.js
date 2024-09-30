const argon2 = require("argon2");
const { database } = require("./db");


// Change password
const handler = async (req) => {
  const { username, currentPassword, newPassword } = JSON.parse(req.body);

  if (newPassword.length < 18 || newPassword.length > 30) {
    return { statusCode: 400, body: JSON.stringify( { message: "Password must be between 18 and 30 characters" } )};
  }

  try {
    const collection = database.collection("User");
    const user = await collection.findOne({ username });

    const isMatch = await argon2.verify(user.password, currentPassword);
    if (!isMatch) {
      return { statusCode: 400, body: JSON.stringify( { message: "Invalid credentials" }) };
    }

    const hashedPassword = await argon2.hash(newPassword);
    await collection.updateOne({ username }, { $set: { password: hashedPassword } });
    return { statusCode: 200, body: JSON.stringify( { message: "Password changed successfully" } )};
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
    
  }
}

module.exports = { handler };
