import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/PcuDiaries';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a model for blog posts
const Post = mongoose.model('Post', {
  title: String,
  content: String,
  publishTime: Date,
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.get("/", async (req, res) => {
  try {
    // Fetch all blog posts from the database
    const posts = await Post.find().sort({ publishTime: -1 }).exec();
    res.render("index.ejs", { posts: posts });
  } catch (error) {
    res.status(500).send("Error fetching posts: " + error);
  }
});

app.get('/create', (req, res) => {
  res.render('create.ejs');
});

app.get('/github', (req, res) => {
  res.redirect('https://github.com/CARBON03');
});

app.get('/linkedin', (req, res) => {
  res.redirect('https://www.linkedin.com/in/singhmohnish');
});

app.get('/youtube', (req, res) => {
  res.redirect('https://www.youtube.com/@mohnishsingh03');
});

// New route to handle blog post creation
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, publishTime } = req.body;
    const post = new Post({ title, content, publishTime });
    await post.save();
    res.status(201).json({ message: 'Post saved successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error saving post', error });
  }
});

//New route for specific blog post

app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('blog-post.ejs', { post: post });
  } catch (error) {
    res.status(500).send('Post not found');
  }
});


app.listen(port, () => {
  console.log(`Server is Live on port ${port}`);
});