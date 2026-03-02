import { IPaginationOptions } from "../types";

type IOptionsResult = Required<IPaginationOptions> & {
  skip: number;
};
export const calculatePagination = (
  options: IPaginationOptions,
): IOptionsResult => {
  const page = +(options.page || 1);
  const limit = +(options.limit || 20);
  const skip = (page - 1) * limit;

  const sortBy = options?.sort_by || "created_at";
  const sortOrder = options?.sort_order || "DESC";

  return {
    page,
    limit,
    skip,
    sort_by: sortBy,
    sort_order: sortOrder,
  };
};
