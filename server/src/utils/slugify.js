import slugify from "slugify";

export const toSlug = (value = "") => {
  return slugify(String(value), {
    lower: true,
    strict: true,
    trim: true,
  });
};
