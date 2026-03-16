import prisma from "../utils/prisma.js";
import catchAsync from "../utils/catchAsync.js";
import { supabase } from "../lib/supabase.js";

export const createPost = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    const error = new Error("Title and content are required!");
    error.statusCode = 400;
    throw error;
  }

  let imageUrl = null;

  if (req.file) {
    const fileName = `posts/post-${Date.now()}-${req.file.originalname}`;

    const { error } = await supabase.storage
      .from("personal")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("personal")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      image: imageUrl,
    },
  });

  res.status(201).json({
    status: "success",
    data: { newPost },
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

export const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

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

  // delete image from Supabase Storage
  if (post.image) {
    const marker = "/storage/v1/object/public/personal/";
    const filePath = post.image.includes(marker)
      ? post.image.split(marker)[1]
      : null;

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("personal")
        .remove([filePath]);

      if (storageError) {
        console.error("Failed to delete image from Supabase:", storageError.message);
      }
    }
  }

  // delete post from database
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
  const id = Number(req.params.id);
  const { title, content } = req.body;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    const error = new Error("Post not found!");
    error.statusCode = 404;
    throw error;
  }

  let imageUrl = post.image;

  if (req.file) {

    // delete old image from supabase
    if (post.image) {
      const marker = "/storage/v1/object/public/personal/";
      const oldPath = post.image.includes(marker)
        ? post.image.split(marker)[1]
        : null;

      if (oldPath) {
        const { error: deleteError } = await supabase.storage
          .from("personal")
          .remove([oldPath]);

        if (deleteError) {
          console.error("Failed to delete old image:", deleteError.message);
        }
      }
    }

    // upload new image
    const fileName = `posts/post-${Date.now()}-${req.file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("personal")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // get public url
    const { data } = supabase.storage
      .from("personal")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title: title || post.title,
      content: content || post.content,
      image: imageUrl,
    },
  });

  res.status(200).json({
    status: "success",
    data: { updatedPost },
  });
});

