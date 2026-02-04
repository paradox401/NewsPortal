import imagekit from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";

export const uploadImagesToImageKit = async (files = [], folder = "news-portal") => {
  if (!files.length) return [];

  try {
    const uploads = files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const uploadable = await toFile(file.buffer, fileName);
      return imagekit.beta.v2.files.upload({
        file: uploadable,
        fileName,
        folder,
        useUniqueFileName: true,
      });
    });

    const results = await Promise.all(uploads);
    return results.map((result) => result.url);
  } catch (error) {
    console.error("ImageKit upload error:", error?.message || error);
    throw error;
  }
};
