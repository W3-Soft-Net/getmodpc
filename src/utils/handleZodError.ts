import { ZodError } from "zod";
import { IGenericErrorMessage, IGenericErrorResponse } from "../types/index";
const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error?.issues.map((issue) => {
    return {
      path: issue?.path[issue?.path?.length - 1] as string,
      message: issue?.message,
    };
  });

  return {
    statusCode: 400,
    message: "Validation error",
    errorMessages: errors,
  };
};
export default handleZodError;
