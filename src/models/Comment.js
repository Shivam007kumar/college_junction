import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;