import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";


export const createPortfolio = catchAsync(async (req, res) => {
    const {title, link} = req.body;

    if (!title || !link) {
    const error = new Error("Title and link are required!");
    error.statusCode = 400;
    throw error;
  }

  const newPortfolio = await prisma.portfolio.create({
    data: {
        title,
        link
    },
  })

  res.status(201).json({
    status: "success",
    data: {
      portfolio: newPortfolio,
    },
  });
})