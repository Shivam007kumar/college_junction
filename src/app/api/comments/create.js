import dbConnect from '../../../lib/dbConnect';
import Comment from '../../../models/Comment';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { content, postId } = req.body;

    try {
      const comment = new Comment({ content, postId });
      await comment.save();

      const post = await Post.findById(postId);
      post.comments.push(comment._id);
      await post.save();

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}