const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

console.log("loading the blog");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });

  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = await request.user;
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = await request.user;
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
    return null;
  } else {
    return response.status(401).json({ error: "token invalid" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  // before doing anything, check if the id exists
  const blog = await Blog.findById(request.params.id);
  if (blog === null) {
    response.status(404).send({ error: "unknown endpoint" });
    return null;
  }
  const body = request.body;

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
