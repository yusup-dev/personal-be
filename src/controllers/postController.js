import prisma from "../utils/prisma.js";
import fs from "fs";
import path from "path";
import catchAsync from "../utils/catchAsync.js";

export const createPost = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  // check does image exist or not
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // check the inputs
  if (!title || !content) {
    const error = new Error("Title and content are required!");
    error.statusCode = 400;
    throw error;
  }
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      image: imagePath,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newPost,
    },
  });
});

// Get all post
export const getAllPosts = catchAsync(async (req, res) => {
  const posts = await prisma.post.findMany({});

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: { posts },
  });
});

// Get single post
export const getPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    }
  });

  // check the existence of the post
  if (!post) {
    const error = new Error("Post not found!");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

// Delete a post
export const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  // get a post for check the existence of it and its image
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!post) {
    const error = new Error("Post not found!");
    error.statusCode = 404;
    throw error;
  }

  // delete the image from hard disk
  if (post.image) {
    const filePath = path.join("public", post.image);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete local image", err);
      } else {
        console.log("Local image deleted successfully");
      }
    });
  }

  // delete from the database
  await prisma.post.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Update a post
export const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // first find a old post
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!post) {
    const error = new Error("Post not found!");
    error.statusCode = 404;
    throw error;
  }

  // manage the image
  // default set it to previous image
  let imagePath = post.image;

  // if user send new image
  if (req.file) {
    // setting new image path
    imagePath = `/uploads/${req.file.filename}`;

    // delete the old image
    if (post.image) {
      const oldPath = path.join("public", post.image);
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error("Failed to delete old image", err);
        } else {
          console.log("Old image deleted successfully");
        }
      });
    }
  }

  // update the post
  const updatedPost = await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: title || post.title, // if title was not new ,set it to old title
      content: content || post.content, // if the content was not new , set it to old content
      image: imagePath,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedPost,
    },
  });
});

export const getPostImage = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!post || !post.image) {
    const error = new Error("Image not found!");
    error.statusCode = 404;
    throw error;
  }

  const imagePath = path.join("public", post.image);

  res.sendFile(path.resolve(imagePath));
});
