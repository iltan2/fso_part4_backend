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


module.exports = {initialBlogs}