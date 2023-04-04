const config = require('./utils/config')

const express = require('express')
const app = express()
const cors = require('cors')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
// const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
//app.use(middleware.requestLogger)

const Blog = mongoose.model('Blog', blogSchema)


app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = process.env.PORT
