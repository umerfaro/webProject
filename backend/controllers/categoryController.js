// import Category from "../models/categoryModel.js";
// import asyncHandler from "../middlewares/asyncHandler.js";

// const createCategory = asyncHandler(async (req, res) => {
//   try {
//     const { name } = req.body;

//     if (!name) {
//       return res.json({ error: "Name is required" });
//     }

//     const existingCategory = await Category.findOne({ name });

//     if (existingCategory) {
//       return res.json({ error: "Already exists" });
//     }

//     const category = await new Category({ name }).save();
//     res.json(category);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error);
//   }
// });

// const updateCategory = asyncHandler(async (req, res) => {
//   try {
//     const { name } = req.body;
//     const { categoryId } = req.params;

//     const category = await Category.findOne({ _id: categoryId });

//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }

//     category.name = name;

//     const updatedCategory = await category.save();
//     res.json(updatedCategory);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// const removeCategory = asyncHandler(async (req, res) => {
//   try {
//     const removed = await Category.findByIdAndRemove(req.params.categoryId);
//     res.json(removed);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// const listCategory = asyncHandler(async (req, res) => {
//   try {
//     const all = await Category.find({});
//     res.json(all);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error.message);
//   }
// });

// const readCategory = asyncHandler(async (req, res) => {
//   try {
//     const category = await Category.findOne({ _id: req.params.id });
//     res.json(category);
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error.message);
//   }
// });

// export {
//   createCategory,
//   updateCategory,
//   removeCategory,
//   listCategory,
//   readCategory,
// };


// controllers/categoryController.js
import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check if the category already exists for this user
    const existingCategory = await Category.findOne({ name, user: req.user._id });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await new Category({ name, user: req.user._id }).save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// List Categories (User-Specific)
const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId, user: req.user._id });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Remove Category
const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const removed = await Category.findOneAndRemove({ _id: categoryId, user: req.user._id });

    if (!removed) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Read Category (Optional: Ensure it belongs to the user)
const readCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, user: req.user._id });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
