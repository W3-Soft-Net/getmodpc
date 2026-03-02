import { AppDataSource } from "../config/db";
import { AdminConstant } from "../const/admin.const";
import { Admin } from "../models/admin.model";
import { IAdminFilters, IGenericResponse, IPaginationOptions } from "../types";
import ApiError from "../utils/ApiError";
import { calculatePagination } from "../utils/pagination";
import httpStatusCodes from "http-status-codes";
import { deleteFromS3 } from "../utils/s3Upload";
export class AdminService {
  private adminRepository = AppDataSource.getRepository(Admin);
  async getAllAdminUsers(
    filters: IAdminFilters,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<Admin[]>> {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);
    const query = this.adminRepository.createQueryBuilder("admin");
    // Apply search
    if (searchTerm) {
      const searchConditions = AdminConstant.adminSearchFields.map(
        (field) => `admin.${field} ILIKE :search`
      );
      query.andWhere(`(${searchConditions.join(" OR ")})`, {
        search: `%${searchTerm}%`,
      });
    }

    Object.keys(filtersData).forEach((key) => {
      query.andWhere(`admin.${key} = :${key}`, {
        [key]: (filtersData as any)[key],
      });
    });

    const total = await query.getCount();
    query.orderBy(`admin.${sortBy}`, sortOrder as "ASC" | "DESC");
    query.skip(skip).take(limit);

    const data = await query.getMany();

    return {
      meta: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getAdminUserById(id: string) {
    return await this.adminRepository.findOneBy({ id });
  }

  async createAdminUser(admin: Partial<Admin>): Promise<Admin> {
    const addNewAdmin = this.adminRepository.create(admin);
    const savedAdmin = await this.adminRepository.save(addNewAdmin);
    const { password, ...rest } = savedAdmin;
    return rest as Admin;
  }

  public async updateAdminUser(
    adminId: string,
    payload: Partial<Admin>
  ): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id: adminId });

    if (!admin) {
      if (payload.avatar) await deleteFromS3(payload.avatar);
      throw new ApiError(httpStatusCodes.NOT_FOUND, "Admin user not found");
    }

    if (payload.avatar && admin.avatar && payload.avatar !== admin.avatar) {
      await deleteFromS3(admin.avatar);
    }

    // Merge new data
    this.adminRepository.merge(admin, payload);
    const updateAdmin = await this.adminRepository.save(admin);
    const { password, ...rest } = updateAdmin;
    return rest as Admin;
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    // Find existing admin
    const existingAdmin = await this.adminRepository.findOneBy({ id });
    if (!existingAdmin) {
      throw new ApiError(httpStatusCodes.NOT_FOUND, "Admin user not found");
    }

    // Delete admin from DB
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new ApiError(
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to delete admin user"
      );
    } else {
      if (existingAdmin.avatar) {
        await deleteFromS3(existingAdmin.avatar);
      }
    }

    return true;
  }
}
