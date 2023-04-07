const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Test Title",
    author: "Test author",
    url: "Test url",
    likes: 12345
  },
  {
    title: "Test Title 2",
    author: "Test author 2",
    url: "Test url 2",
    likes: 10
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})


test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test('there are two records', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('the first record title is Test', async () => {
  const response = await api.get('/api/blogs')

  const 
  expect(response.body[0].title).toBe('Test Title')
})

afterAll(async () => {
  await mongoose.connection.close();
});
