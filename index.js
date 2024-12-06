const { initialization } = require("./db/db.connect");
const Recipe = require("./models/recipe.model");

initialization();

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { uploadCloudinary } = require("./utils/cloudinary");

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  openSuccessStatus: 200,
};
app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //const assetsPath = path.join(__dirname, "assets");
    return cb(null, "/tmp");
  },

  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.get("/", (req, res) => res.send("Express started"));

app.post("/add/recipe", async (req, res) => {
  const recipeData = req.body;

  try {
    const { name, cusineType, imageLink, ingredients, instructions } =
      recipeData;

    const newRecipe = new Recipe({
      name,
      cusineType,
      imageLink,
      ingredients,
      instructions,
    });

    const savedRecipe = newRecipe.save();

    if (!savedRecipe)
      return res.status(404).json({ message: "Cannot save recipe data" });

    return res
      .status(201)
      .json({ message: "Saved recipe data successfully", savedRecipe });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/*
app.post(
  "/add/recipe",
  upload.fields([{ name: "imageLink", maxCount: 1 }]),
  async (req, res) => {
    const { name, cusineType, ingredients, instructions } = req.body;

    try {
      let recipeImgUrl = null;
      const recipeImgLocalPath = req.files?.imageLink?.[0]?.path;

      if (recipeImgLocalPath) {
        const recipeImg = await uploadCloudinary(recipeImgLocalPath);

        if (!recipeImg) {
          return res.status(400).json({ message: "Failed to upload image" });
        }

        recipeImgUrl = recipeImg.url;
      }

      if (!recipeImgUrl) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      const newRecipe = new Recipe({
        name,
        cusineType,
        imageLink: recipeImgUrl,
        ingredients,
        instructions,
      });

      const savedRecipe = await newRecipe.save();

      if (!savedRecipe) {
        return res.status(404).json({ message: "Recipe cannot get save" });
      }

      return res.status(201).json({ message: "Saved recipe", savedRecipe });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);
*/

app.get("/get/all/recipe", async (req, res) => {
  try {
    const recipeDetails = await Recipe.find();

    if (!recipeDetails)
      return res.status(404).json({ message: "recipe details not found" });

    return res
      .status(201)
      .json({ message: "Found recipe successfully", recipeDetails });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete/recipe/:recipeId", async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe)
      return res.status(404).json({ message: "failed to delete recipe" });

    return res.status(201).json({ message: "Deleted recipe" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log("Started server at port", PORT));
