import slugify from "slugify";
import { Repository } from "typeorm";
import { Category } from "../models/category.model";

export const generateUniqueSlug = async (
  name: string,
  repo: Repository<Category>,
  excludeId?: string,
): Promise<string> => {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await repo.findOne({ where: { slug } });

    if (!existing || existing.id === excludeId) break;

    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};
