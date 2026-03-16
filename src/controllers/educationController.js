import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";

export const createEducation = catchAsync(async (req, res) => {
  const { degree, school, location, startDate, endDate, gpa, description } = req.body;

  const newEducation = await prisma.education.create({
    data: {
      degree,
      school,
      location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      gpa,
      description
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newEducation,
    },
  });
});

export const getAllEducation = catchAsync(async (req, res) => {
    const education = await prisma.education.findMany({});

    res.status(200).json({
    status: "success",
    results: education.length,
    data: { education },
  });
});

export const updateEducation = catchAsync(async (req, res) => {
    const {id} = req.params;
       const { degree, school, location, startDate, endDate, gpa, description } = req.body;

        const education = await prisma.education.findUnique({
            where: {
                id: parseInt(id),
            }
        });

        if (!education) {
    const error = new Error("Education not found!");
    error.statusCode = 404;
    throw error;
  }

  const updatedEducation = await prisma.education.update({
    where: {
      id: parseInt(id),
    },
    data: {
      degree: degree ?? education.degree,
      school: school ?? education.school,
      location: location ?? education.location,
      startDate: startDate ? new Date(startDate) : education.startDate,
      endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : experience.endDate,
      gpa: gpa ?? education.gpa,
      description: description ?? education.description,
    }
  });

  res.status(200).json({
    status :"success",
    data: {
        updatedEducation,
    }
  });
});

export const deleteEducation = catchAsync(async (req, res) => {
  const { id } = req.params;

  const education = await prisma.education.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!education) {
    const error = new Error("Education not found!");
    error.statusCode = 404;
    throw error;
  }

  await prisma.education.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    status: "success",
    data: null,
  });
});


