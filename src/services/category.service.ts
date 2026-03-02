import { AppDataSource } from "../config/db";
import { Category } from "../models/category.model";
import {
  ICategoryFilters,
  IGenericResponse,
  IPaginationOptions,
} from "../types";
import ApiError from "../utils/ApiError";
import httpStatusCodes from "http-status-codes";
import { calculatePagination } from "../utils/pagination";
import { CategoryConstant } from "../const/category.const";
export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async getAllCategories(
    filters: ICategoryFilters,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<Category[]>> {
    const { searchTerm, ...filtersData } = filters;

    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    const query = this.categoryRepository.createQueryBuilder("categories");

    // Apply search
    if (searchTerm) {
      const searchConditions = CategoryConstant.categorySearchFields.map(
        (field) => `categories.${field} ILIKE :search`
      );
      query.andWhere(`(${searchConditions.join(" OR ")})`, {
        search: `%${searchTerm}%`,
      });
    }

    if (Object.keys(filtersData).length > 0) {
      Object.entries(filtersData).forEach(([key, value]) => {
        query.andWhere(`categories.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    query
      .orderBy(`categories.${sortBy}`, sortOrder as "ASC" | "DESC")
      .skip(skip)
      .take(limit);

    const data = await query.getMany();
    return {
      data,
      meta: {
        page,
        limit,
        total: await query.getCount(),
      },
    };
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async createCategory(category: Category): Promise<Category> {
    const newCategory = this.categoryRepository.create(category);
    return await this.categoryRepository.save(newCategory);
  }

  async updateCategory(
    id: string,
    categoryData: Partial<Category>
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new ApiError(httpStatusCodes.NOT_FOUND, "Category not found");
    }
    return await this.categoryRepository.save({
      ...category,
      ...categoryData,
    });
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new ApiError(httpStatusCodes.NOT_FOUND, "Category not found");
    }
    return await this.categoryRepository.remove(category);
  }
}
