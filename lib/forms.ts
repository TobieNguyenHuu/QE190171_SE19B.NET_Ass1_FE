import { ApiError, errorMessage } from "./api";

/** Shows server-side field errors under the inputs and always raises a toast with the message. */
export function reportSubmitError(
  error: unknown,
  setErrors: (errors: Record<string, string>) => void,
  toastError: (message: string) => void,
) {
  if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
    setErrors(error.fieldErrors);
  }
  toastError(errorMessage(error));
}
