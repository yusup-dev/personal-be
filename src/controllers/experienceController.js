import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";

export const createExperience = catchAsync(async (req, res) => {
  const { position, company, location, description, startDate, endDate } = req.body;

  const newExperience = await prisma.experience.create({
    data: {
      position,
      company,
      location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newExperience,
    },
  });
});

export const getAllExperience = catchAsync(async (req, res) => {
    const experience = await prisma.experience.findMany({});

    res.status(200).json({
    status: "success",
    results: experience.length,
    data: { experience },
  });
});

export const updateExperience = catchAsync(async (req, res) => {
    const {id} = req.params;
        const { position, company, location, startDate, endDate, description} = req.body;

        const experience = await prisma.experience.findUnique({
            where: {
                id: parseInt(id),
            }
        });

        if (!experience) {
    const error = new Error("Experience not found!");
    error.statusCode = 404;
    throw error;
  }

  const updatedExperience = await prisma.experience.update({
    where: {
      id: parseInt(id),
    },
    data: {
      position: position ?? experience.position,
      company: company ?? experience.company,
      location: location ?? experience.location,
      startDate: startDate ? new Date(startDate) : experience.startDate,
      endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : experience.endDate,
      description: description ?? experience.description,
    }
  });

  res.status(200).json({
    status :"success",
    data: {
        updatedExperience,
    }
  });
});

export const deleteExperience = catchAsync(async (req, res) => {
  const { id } = req.params;

  const experience = await prisma.experience.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!experience) {
    const error = new Error("Experience not found!");
    error.statusCode = 404;
    throw error;
  }

  await prisma.experience.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});