const {database} = require('./db');

// GET MENU TODAY
const handler = async (req) => {
  try {
    const collection = database.collection('Menu'); // your menu collection

    // Find the menu for today
    //check day of the week
    const today = new Date();
    const day = today.getDay();
    let day_string = "";
    switch (day) {
      case 0:
        day_string = "Sunday";
        break;
      case 1:
        day_string = "Monday";
        break;
      case 2:
        day_string = "Tuesday";
        break;
      case 3:
        day_string = "Wednesday";
        break;
      case 4:
        day_string = "Thursday";
        break;
      case 5:
        day_string = "Friday";
        break;
      case 6:
        day_string = "Saturday";
        break;
    }

    //check username
    const username = JSON.parse(req.body).username;

    const menu = await collection
        .find({ Username: username, Day: day_string })
        .toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ menu: menu }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };