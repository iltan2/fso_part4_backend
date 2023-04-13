const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const helper = require("./blog_test_helper");

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
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
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const blogLikes = response.body.find((r)=> r.title==="new title test 2").likes;

  expect(blogLikes).toBe(0);
});


test("title is required", async () => {
  const newBlog = {
    author: "new author test",
    url: "new url test",
    likes: 100,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)

});

test("url is required", async () => {
  const newBlog = {
    author: "new author test",
    title: "new title test",
    likes: 101,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)

});

afterAll(async () => {
  await mongoose.connection.close();
});
