import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";

export const createPortfolio = catchAsync(async (req, res) => {
  const { title, github, article } = req.body;

  if (!title || !github || !article) {
    const error = new Error("Title, github, article are required!");
    error.statusCode = 400;
    throw error;
  }

  const newPortfolio = await prisma.portfolio.create({
    data: {
      title,
      github,
      article,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newPortfolio,
    },
  });
});

// Get All
export const getAllPortfolio = catchAsync(async (req, res) => {
  const portfolio = await prisma.portfolio.findMany({});

  res.status(200).json({
    status: "success",
    results: portfolio.length,
    data: { portfolio },
  });
});

export const updatePortfolio = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, github, article } = req.body;

  const portfolio = await prisma.portfolio.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!portfolio) {
    const error = new Error("Portfolio not found!");
    error.statusCode = 404;
    throw error;
  }

  const updatedPortfolio = await prisma.portfolio.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: title || portfolio.title,
      github: github || portfolio.github,
      article: article || portfolio.article
    },
  });

  res.status(200).json({
    status: "success",
    data: {
     updatedPortfolio,
    },
  });
});

export const deletePortfolio = catchAsync(async (req, res) => {
  const { id } = req.params;

  const portfolio = await prisma.portfolio.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!portfolio) {
    const error = new Error("Portfolio not found!");
    error.statusCode = 404;
    throw error;
  }

  await prisma.portfolio.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
