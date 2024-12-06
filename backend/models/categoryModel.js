// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     trim: true,
//     required: true,
//     maxLength: 32,
//     unique: true,
//   },
// });

// export default mongoose.model("Category", categorySchema);


// models/categoryModel.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Ensure category names are unique per user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
