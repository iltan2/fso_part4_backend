const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const helper = require("./blog_test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

let blogObject;
let token;
beforeEach(async () => {
  const users = await User.find({});
  const user = users[0];
  const userForToken = { username: user.username, id: user._id };
  token = jwt.sign(userForToken, process.env.SECRET);

  await Blog.deleteMany({});
  blogObject = new Blog({...helper.initialBlogs[0], user: user._id});
  await blogObject.save();
  blogObject = new Blog({...helper.initialBlogs[1], user: user._id});
  await blogObject.save();

});

test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific title is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((r) => r.title);
  expect(titles).toContain("Test Title");
});

test("identifier is id", () => {
  if (blogObject.length > 0) {
    blogObject.map((blog) => {
      expect(blog.id).toBeDefined();
    });
  }
});

test("identifier is not _id", () => {
  if (blogObject.length > 0) {
    blogObject.map((blog) => {
      expect(blog._id).not.toBeDefined();
    });
  }
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "new title test",
    author: "new author test",
    url: "new url test",
    likes: 100,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain("new title test");
});

test("default likes is 0", async () => {
  const newBlog = {
    title: "new title test 2",
    author: "new author test 2",
    url: "new url test 2",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const blogLikes = response.body.find(
    (r) => r.title === "new title test 2"
  ).likes;

  expect(blogLikes).toBe(0);
});

test("title is required", async () => {
  const newBlog = {
    author: "new author test",
    url: "new url test",
    likes: 100,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("url is required", async () => {
  const newBlog = {
    author: "new author test",
    title: "new title test",
    likes: 101,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("succeeds with status code 204 if id is valid", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).set("Authorization", `Bearer ${token}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((r) => r.title);

  expect(titles).not.toContain(blogToDelete.title);
});

test("updates the blog with new data", async () => {
  const newBlog = {
    url: "put url test",
    author: "put author test",
    title: "put title test",
    likes: 99,
  };

  const response = await api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(newBlog).expect(201);

  const blogId = response.body.id;

  const updatedBlog = {
    url: "put updated url test",
    author: "put updated author test",
    title: "put updated title test",
    likes: 123,
  };

  const updatedResponse = await api
    .put(`/api/blogs/${blogId}`)
    .send(updatedBlog)
    .expect(200);

  const updatedBody = updatedResponse.body;

  expect(updatedBody.title).toBe(updatedBlog.title);
  expect(updatedBody.author).toBe(updatedBlog.author);
  expect(updatedBody.url).toBe(updatedBlog.url);
  expect(updatedBody.likes).toBe(updatedBlog.likes);
});

test("returns 400 if id is malformatted", async () => {
  const newBlog = {
    url: "put url test",
    author: "put author test",
    title: "put title test",
    likes: 99,
  };

  const response = await api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(newBlog).expect(201);

  const updatedBlog = {
    url: "put updated url test",
    author: "put updated author test",
    title: "put updated title test",
    likes: 123,
  };

  const invalidId = "9999999999";

  const updatedResponse = await api
    .put(`/api/blogs/${invalidId}`)
    .send(updatedBlog)
    .expect(400);
});

test("returns 404 if id is not found", async () => {
  const newBlog = {
    url: "put url test",
    author: "put author test",
    title: "put title test",
    likes: 99,
  };

  const response = await api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(newBlog).expect(201);

  const updatedBlog = {
    url: "put updated url test",
    author: "put updated author test",
    title: "put updated title test",
    likes: 123,
  };

  const invalidId = "111ea21f9e37bd8fc983b111";

  const updatedResponse = await api.put(`/api/blogs/${invalidId}`).expect(404);
});

afterAll(async () => {
  await mongoose.connection.close();
});
