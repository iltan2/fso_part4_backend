const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0 || blogs === null) {
    return 0;
  }
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0 || blogs === null) {
    return {};
  }
  const tempBlog = blogs.reduce((currBlog, blog) => {
    return currBlog.likes > blog.likes ? currBlog : blog;
  });

  return {
    title: tempBlog.title,
    author: tempBlog.author,
    likes: tempBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0 || blogs === null) {
    return {};
  }
  console.log(blogs)
  const newBlogs = [];
  const authors = [];
  blogs.forEach((blog) => {
    idx = authors.indexOf(blog.author);
    if (idx === -1) {
      authors.push(blog.author);
      newBlogs.push({ author: blog.author, blogs: 1 });
    } else {
      newBlogs[idx] = {
        author: newBlogs[idx].author,
        blogs: newBlogs[idx].blogs + 1,
      };
    }
  });
  const tempBlog = newBlogs.reduce((currBlog, blog) => {
    return currBlog.blogs > blog.blogs ? currBlog : blog;
  });

  return { author: tempBlog.author, blogs: tempBlog.blogs };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0 || blogs === null) {
    return {};
  }
  console.log(blogs)
  const newBlogs = [];
  const authors = [];
  blogs.forEach((blog) => {
    idx = authors.indexOf(blog.author);
    if (idx === -1) {
      authors.push(blog.author);
      newBlogs.push({ author: blog.author, likes: blog.likes });
    } else {
      newBlogs[idx] = {
        author: newBlogs[idx].author,
        likes: newBlogs[idx].likes + blog.likes,
      };
    }
  });
  const tempBlog = newBlogs.reduce((currBlog, blog) => {
    return currBlog.likes > blog.likes ? currBlog : blog;
  });

  return { author: tempBlog.author, likes: tempBlog.likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
