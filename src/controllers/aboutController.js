import catchAsync from "../utils/catchAsync.js";
import prisma from "../utils/prisma.js";
import { supabase } from "../lib/supabase.js";


export const updateAbout = catchAsync(async (req, res) => {
  const { title, shortDescription, description, contactLink } = req.body;
  const id = Number(req.params.id);

  const about = await prisma.about.findUnique({
    where: { id },
  });

  if (!about) {
    const error = new Error("About not found!");
    error.statusCode = 404;
    throw error;
  }

  let pdfUrl = about.resumeUrl;

  if (req.file) {
    // delete old resume from supabase
    if (about.resumeUrl) {
      const marker = "/storage/v1/object/public/personal/";
      const oldPath = about.resumeUrl.includes(marker)
        ? about.resumeUrl.split(marker)[1]
        : null;

      if (oldPath) {
        const { error: deleteError } = await supabase.storage
          .from("personal")
          .remove([oldPath]);

        if (deleteError) {
          console.error("Failed to delete old resume:", deleteError.message);
        }
      }
    }

    // upload new resume
    const fileName = `resume-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("personal")
      .upload(`pdf/${fileName}`, req.file.buffer, {
        contentType: "application/pdf",
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // get public url
    const { data } = supabase.storage
      .from("personal")
      .getPublicUrl(`pdf/${fileName}`);

    pdfUrl = data.publicUrl;
  }

  const updatedAbout = await prisma.about.update({
    where: { id },
    data: {
      title: title || about.title,
      shortDescription: shortDescription || about.shortDescription,
      description: description || about.description,
      contactLink: contactLink || about.contactLink,
      resumeUrl: pdfUrl,
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