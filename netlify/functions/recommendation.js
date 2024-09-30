const {database} = require('./db');

function escapeRegex(string) {
    return string.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'); // Escape special characters
  }

// GET RECOMENDED RECIPES
const handler = async (req) => {
  const { username, page = 1, limit = 10, search = '', includeT = [], excludeT = [], includeI = [], excludeI = [] } = JSON.parse(req.body);
  const skip = (page - 1) * limit;

  try {
    const userInventories = await database.collection('Inventory').find({ Username: username }).toArray();
    const userInventory = userInventories.map(inventory => inventory.Name);

    // if user has no inventory, return empty array
    if (userInventory.length === 0) {
      return {
        recipes: [], // Empty array
        currentPage: page,
        totalPages: 1, // only 1 page
        tags: [], // Empty array
        ingredients: [], // Empty array
        message: "No inventory found, please initialise your inventory first."
      };
    }

    // Create a case-insensitive regex to search by recipe name
    const searchRegex = new RegExp(escapeRegex(search), 'i'); // 'i' for case-insensitive

    // Build the query object with search and filters
    const query = {
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


    // Use aggregation to find recipes and match the user's inventory with recipe ingredients
    const recipes_all = await Recipe.aggregate([
      { $match: query },
      {
        $addFields: {
          matchedIngredients: {
            $size: {
              $filter: {
                input: "$Ingredients",
                as: "ingredient",
                cond: { $in: ["$$ingredient", userInventory] } // Match user's inventory with recipe ingredients
              }
            }
          }
        }
      },
      { $match: { matchedIngredients: { $gt: 0 } } }, // Ensure at least one matching ingredient
      { $sort: { matchedIngredients: -1 } }, // Sort by the number of matched ingredients (descending)
      { $skip: skip }, // Skip previous pages
      { $limit: limit } // Limit the number of results
    ]).toArray();

    // Count total recipes matching the user's inventory
    const totalRecipes = await Recipe.aggregate([
      { $match: query },
      {
        $addFields: {
          matchedIngredients: {
            $size: {
              $filter: {
                input: "$Ingredients",
                as: "ingredient",
                cond: { $in: ["$$ingredient", userInventory] }
              }
            }
          }
        }
      },
      { $match: { matchedIngredients: { $gt: 0 } } }, // Ensure at least one matching ingredient
      { $count: "total" }
    ]).toArray();

    const total = totalRecipes.length > 0 ? totalRecipes[0].total : 0;

    if (total === 0) {
        return {
            recipes: [], // Empty array
            currentPage: page,
            totalPages: 1, // only 1 page
            tags: [], // Empty array
            ingredients: [], // Empty array
            message: "No recipes found matching your inventory."
        };
    }

    // Get all tags and ingredients (before pagination)
    const [recipe_tags, recipe_ingredients] = await Promise.all([
      Recipe.aggregate([
        { $match: Object.keys(query).length ? query : {} },
        { $unwind: "$Tag" },
        { $group: { _id: "$Tag" } },
        { $project: { Tag: "$_id", _id: 0 } }
      ]).toArray(),

      Recipe.aggregate([
        { $match: Object.keys(query).length ? query : {} },
        { $unwind: "$Ingredients" },
        { $group: { _id: "$Ingredients" } },
        { $project: { Ingredients: "$_id", _id: 0 } }
      ]).toArray()
    ]);

    const formatted_tags = recipe_tags.map(tag => tag.Tag);
    const formatted_ingredients = recipe_ingredients.map(ingredient => ingredient.Ingredients);

    return {
        statusCode: 200,
        recipes: recipes_all, // Recipes for the current page
        currentPage: page,
        totalPages: Math.ceil(total / limit), // Total pages based on matching result count
        tags: formatted_tags, // All tags matching the filtered query
        ingredients: formatted_ingredients, // All ingredients matching the filtered query
    };
    } catch (err) {
        return { statusCode: 500, message: 'Error fetching recipes', error: err };
    }
}

module.exports = { handler };


