import { IPaginationOptions } from "../types";

type IOptionsResult = Required<IPaginationOptions> & {
  skip: number;
};
export const calculatePagination = (
  options: IPaginationOptions
): IOptionsResult => {
  const page = +(options.page || 1);
  const limit = +(options.limit || 20);
  const skip = (page - 1) * limit;

  const sortBy = options?.sortBy || "createdAt";
  const sortOrder = options?.sortOrder || "DESC";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
