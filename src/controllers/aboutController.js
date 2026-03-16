import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";
import fs from "fs";
import path from "path";

export const updateAbout = catchAsync(async (req, res) => {
  const { title, shortDescription, description, contactLink } = req.body;
  const id = req.params.id;

  const about = await prisma.about.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!about) {
    const error = new Error("About not found!");
    error.statusCode = 404;
    throw error;
  }

  let pdfPath = about.resumeUrl;

  if (req.file) {
    pdfPath = `/uploads/${req.file.filename}`;

    // delete old pdf
    if (about.resumeUrl) {
      const oldPath = path.join("public", about.resumeUrl);
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error("Failed to delete old pdf", err);
        } else {
          console.log("Old pdf deleted successfully");
        }
      });
    }
  }

  const updatedAbout = await prisma.about.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title: title || about.title,
      shortDescription: shortDescription || about.shortDescription,
      description: description || about.description,
      contactLink: contactLink || about.contactLink,
      resumeUrl: pdfPath,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedAbout,
    },
  });
});

export const getAbout = catchAsync(async (req, res) => {
  const { id } = req.params;
  const about = await prisma.about.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!about) {
    const error = new Error("About not found!");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    data: {
      about,
    },
  });
});

export const downloadResume = catchAsync(async (req, res) => {
  const { id } = req.params;

  const about = await prisma.about.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!about || !about.resumeUrl) {
    const error = new Error("Resume not found!");
    error.statusCode = 404;
    throw error;
  }

  const filePath = path.join("public", about.resumeUrl);

  // check file exist
  if (!fs.existsSync(filePath)) {
    const error = new Error("File not found on server!");
    error.statusCode = 404;
    throw error;
  }

  res.download(filePath, "resume.pdf");
});