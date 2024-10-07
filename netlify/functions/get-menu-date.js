const {database} = require('./db');

// GET MENU TODAY
const handler = async (req) => {
  try {
    const collection = database.collection('Menu'); // your menu collection
    const { Username, Day } = JSON.parse(req.body);

    let day_string = "";
    switch (Day) {
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

    const menu = await collection
        .find({ Username: Username, Day: day_string })
        .toArray();

    // If everything is OK
    return { statusCode: 200, body: JSON.stringify({ menu: menu }) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: "Server error" }) };
    }
}

module.exports = { handler };