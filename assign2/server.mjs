import express from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Load posts data from JSON file
let posts = [];

const loadPosts = async () => {
  try {
    const data = await fs.readFile("posts.json", "utf8");
    posts = JSON.parse(data);
  } catch (error) {
    console.error("Error loading posts:", error);
  }
};

// Load posts data when the server starts
loadPosts();

// Pagination support for GET /posts
app.get("/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < posts.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.posts = posts.slice(startIndex, endIndex);

  res.status(200).json(results);
});

// Retrieve single post by id
app.get("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
});

// Create new post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// Update existing post by id
app.put("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;

  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  posts[postIndex] = { id: postId, title, content };

  res.status(200).json(posts[postIndex]);
});

// Delete post by id
app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(postIndex, 1);

  res.status(204).send(); // No content in response
});

// Authentication middleware
const authenticate = (req, res, next) => {
  // Here you can implement your authentication logic
  // For simplicity, I'm just allowing all requests
  next();
};

// Apply authentication middleware to all routes
app.use(authenticate);

// Handle 404 Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
