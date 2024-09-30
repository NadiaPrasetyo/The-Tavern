const {database} = require('./db');

function escapeRegex(string) {
    return string.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'); // Escape special characters
  }

const handler = async (req) => {
    const { username } = req.queryStringParameters; // Extract username from query params
  
    try {
     
        const collection = database.collection('Menu'); // your menu collection
        const recipeCollection = database.collection('RecipeList'); // your recipe collection
    
        // get the recipes names per day
        const [monday, tuesday, wednesday, thursday, friday, saturday, sunday] = await Promise.all([
        collection.find({ Username: username, Day: "Monday" }, { Name: 1, _id: 0 }).toArray(),
        collection.find({ Username: username, Day: "Tuesday" }, { Name: 1, _id: 0 }).toArray(),
        collection.find({ Username: username, Day: "Wednesday" }, { Name: 1, _id: 0 }).toArray(),
        collection.find({ Username: username, Day: "Thursday" }, { Name: 1, _id: 0 }).toArray(),
        collection.find({ Username: username, Day: "Friday" }, { Name: 1, _id: 0 }).toArray(),
        collection.find({ Username: username, Day: "Saturday" }, { Name: 1, _id: 0 }).toArray(),
        collection.find({ Username: username, Day: "Sunday" }, { Name: 1, _id: 0 }).toArray()
        ]);
        
        // get the recipe details for each day
    
        const mondayRecipes = [];
        for (const recipe of monday) {
        // use regex to search for the recipe name for case insensitivity
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        // add an id to the recipe with name + timestamp to avoid duplicates
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        mondayRecipes.push(recipeDetails);
        }
    
        const tuesdayRecipes = [];
        for (const recipe of tuesday) {
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        tuesdayRecipes.push(recipeDetails);
        }
    
        const wednesdayRecipes = [];
        for (const recipe of wednesday) {
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        wednesdayRecipes.push(recipeDetails);
        }
        
        const thursdayRecipes = [];
        for (const recipe of thursday) {
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        thursdayRecipes.push(recipeDetails);
        }

        const fridayRecipes = [];
        for (const recipe of friday) {
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        fridayRecipes.push(recipeDetails);
        }

        const saturdayRecipes = [];
        for (const recipe of saturday) {
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        saturdayRecipes.push(recipeDetails);
        }

        const sundayRecipes = [];
        for (const recipe of sunday) {
        const searchRegex = new RegExp(escapeRegex(recipe.Name), 'i');
        const recipeDetails = await recipeCollection.findOne({ Name: searchRegex });
        if (!recipeDetails) {
            continue;
        }
        recipeDetails.id = `${recipeDetails.Name}-${Date.now()}`;
        sundayRecipes.push(recipeDetails);
        }

        // If everything is OK
        return {statusCode: 200, body: JSON.stringify({
            Monday: mondayRecipes,
            Tuesday: tuesdayRecipes,
            Wednesday: wednesdayRecipes,
            Thursday: thursdayRecipes,
            Friday: fridayRecipes,
            Saturday: saturdayRecipes,
            Sunday: sundayRecipes
          })};

    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({ message: "Server error" })};
    }

}

module.exports = { handler };