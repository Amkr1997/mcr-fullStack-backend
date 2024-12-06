const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: String,
  cusineType: String,
  imageLink: String,
  ingredients: String,
  instructions: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
