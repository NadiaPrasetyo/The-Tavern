const {database} = require('./db');

// POST RECIPES BY NAME AND FILTER
const handler = async (req) => {
    const { page = 1, limit = 10, search = '', includeT = [], excludeT = [], includeI = [], excludeI = [] } = JSON.parse(req.body);
    const skip = (page - 1) * limit;
  
    try {
      // Create a case-insensitive regex to search by recipe name
      const searchRegex = new RegExp(escapeRegex(search), 'i'); // 'i' for case-insensitive
  
      // Build the query object with search and filters
      let query = {
        Name: { $regex: searchRegex }, // Search by name
      };
  
      // Use $and to combine multiple filter conditions
      const andConditions = [];
  
      // Include tags and ingredients
      if (includeT.length > 0) {
        andConditions.push({ Tag: { $all: includeT } }); // Include tags
      }
  
      if (includeI.length > 0) {
        andConditions.push({ Ingredients: { $all: includeI } }); // Include ingredients
      }
  
      // Exclude tags and ingredients
      if (excludeT.length > 0) {
        andConditions.push({ Tag: { $nin: excludeT } }); // Exclude tags
      }
  
      if (excludeI.length > 0) {
        andConditions.push({ Ingredients: { $nin: excludeI } }); // Exclude ingredients
      }
  
      // If there are any conditions, add them to the query
      if (andConditions.length > 0) {
        query.$and = andConditions;
      }
  
      // Fetch filtered recipes based on the search query and filters, then apply pagination
      let recipes_all = database.collection('RecipeList').find(query); // Search by name and filters
  
      let length = await database.collection('RecipeList').countDocuments(query); // Count filtered results
  
      // if there's no recipe found, try to search by tags
      if (length === 0) {
        query = {
          Tag: { $regex: searchRegex }, // Search by tag
        };
        if (andConditions.length > 0) {
          query.$and = andConditions;
        }
        recipes_all = database.collection('RecipeList').find(query); // Search by tag
        length = await database.collection('RecipeList').countDocuments(query); // Count filtered results

        // if there's no recipe found, try to search by ingredients
        if (length === 0) {
          query = {
            Ingredients: { $regex: searchRegex }, // Search by ingredients
          };
          if (andConditions.length > 0) {
            query.$and = andConditions;
          }
          recipes_all = database.collection('RecipeList').find(query); // Search by ingredients
        }
    }
    // Get paginated recipes
    const recipes = await recipes_all
      .skip(skip) // Skip previous pages
      .limit(limit) // Limit the number of results
      .toArray();

    // Get all tags and ingredients (before pagination)
    // Aggregation for distinct tags
    const recipe_tags = await database.collection('RecipeList').aggregate([
      { $match: Object.keys(query).length ? query : {} },
      { $unwind: "$Tag" },
      { $group: { _id: "$Tag" } },
      { $project: { Tag: "$_id", _id: 0 } }
    ]).toArray();

    // Convert recipe_tags array to a simple array of tag strings
    const formatted_tags = recipe_tags.map(tag => tag.Tag);

    // Aggregation for distinct ingredients
    const recipe_ingredients = await database.collection('RecipeList').aggregate([
      { $match: Object.keys(query).length ? query : {} },
      { $unwind: "$Ingredients" },
      { $group: { _id: "$Ingredients" } },
      { $project: { Ingredients: "$_id", _id: 0 } }
    ]).toArray();

    // Convert recipe_ingredients array to a simple array of ingredient strings
    const formatted_ingredients = recipe_ingredients.map(ingredient => ingredient.Ingredients);

    // Count total recipes
    const totalRecipes = await database.collection('RecipeList').countDocuments(query); // Count filtered results

    return { statusCode: 200, body: JSON.stringify({
        recipes, // Recipes for the current page
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / limit), // Total pages based on search result count
        tags: formatted_tags, // All tags matching the filtered query
        ingredients: formatted_ingredients, // All ingredients matching the filtered query
        })};
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Error fetching recipes', error: err }) };
        }
    }

module.exports = { handler };