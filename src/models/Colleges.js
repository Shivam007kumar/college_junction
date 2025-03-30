import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
  name: String,
  department: String,
  cutoff: Number,
  location: String,
  surrounding: [String],
  ranking: Number,
});

export default mongoose.models.College || mongoose.model("College", CollegeSchema);
