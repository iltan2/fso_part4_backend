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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports = {initialBlogs, nonExistingId, blogsInDb}