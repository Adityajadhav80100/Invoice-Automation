const MAX_FILE_SIZE = 10 * 1024 * 1024;

const VALID_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

export function validateInvoiceFiles(files) {
  if (!files?.length) {
    return { valid: false, message: "Please select at least one file to continue." };
  }

  for (const file of files) {
    if (!VALID_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: "Only PDF, PNG, JPG files are allowed.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: "Each file size must be under 10MB.",
      };
    }
  }

  return { valid: true };
}
