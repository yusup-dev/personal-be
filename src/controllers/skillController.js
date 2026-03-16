import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";

export const createSkill = catchAsync(async (req, res) => {
  const { name, category } = req.body;

  const newSkill = await prisma.skill.create({
    data: {
      name,
      category,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newSkill,
    },
  });
});

export const getAllSkills = catchAsync(async (req, res) => {
  const skill = await prisma.skill.findMany({});

  res.status(200).json({
    status: "success",
    results: skill.length,
    data: { skill },
  });
});

export const updateSkill = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const skill = await prisma.skill.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!skill) {
    const error = new Error("Skill not found!");
    error.statusCode = 404;
    throw error;
  }

  const updatedSkill = await prisma.skill.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: name ?? skill.name,
      category: category ?? skill.category,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedSkill,
    },
  });
});

export const deleteSkill = catchAsync(async (req, res) => {
  const { id } = req.params;

  const skill = await prisma.skill.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!skill) {
    const error = new Error("Skill not found!");
    error.statusCode = 404;
    throw error;
  }

  await prisma.skill.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});
