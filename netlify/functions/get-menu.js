const {database} = require('./db');
const { ObjectId } = require('mongodb');

const handler = async (req) => {
    const { username } = req.queryStringParameters; // Extract username from query params
  
    try {
     
        const collection = database.collection('Menu'); // your menu collection
        const recipeCollection = database.collection('RecipeList'); // your recipe collection
    
        // get the recipe IDs per day
        const [monday, tuesday, wednesday, thursday, friday, saturday, sunday] = await Promise.all([
            collection.find({ Username: username, Day: "Monday" }, { RecipeId: 1, _id: 0 }).toArray(),
            collection.find({ Username: username, Day: "Tuesday" }, { RecipeId: 1, _id: 0 }).toArray(),
            collection.find({ Username: username, Day: "Wednesday" }, { RecipeId: 1, _id: 0 }).toArray(),
            collection.find({ Username: username, Day: "Thursday" }, { RecipeId: 1, _id: 0 }).toArray(),
            collection.find({ Username: username, Day: "Friday" }, { RecipeId: 1, _id: 0 }).toArray(),
            collection.find({ Username: username, Day: "Saturday" }, { RecipeId: 1, _id: 0 }).toArray(),
            collection.find({ Username: username, Day: "Sunday" }, { RecipeId: 1, _id: 0 }).toArray()
        ]);
        
        async function fetchRecipes(list) {
            const results = [];
            for (const item of list) {
                let id = item.RecipeId;
                let queryId = id;
                try {
                    queryId = typeof id === 'string' ? new ObjectId(id) : id;
                } catch (e) {
                    queryId = id; // fallback: use as-is
                }
                const recipeDetails = await recipeCollection.findOne({ _id: queryId });
                if (!recipeDetails) continue;
                recipeDetails.id = `${recipeDetails._id}-${Date.now()}`;
                results.push(recipeDetails);
            }
            return results;
        }

        const [mondayRecipes, tuesdayRecipes, wednesdayRecipes, thursdayRecipes, fridayRecipes, saturdayRecipes, sundayRecipes] = await Promise.all([
            fetchRecipes(monday),
            fetchRecipes(tuesday),
            fetchRecipes(wednesday),
            fetchRecipes(thursday),
            fetchRecipes(friday),
            fetchRecipes(saturday),
            fetchRecipes(sunday)
        ]);

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