const MAX_FILE_SIZE = 10 * 1024 * 1024;

const VALID_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];

export function validateInvoiceFile(file) {
  if (!file) {
    return { valid: false, message: "Please select a file to continue." };
  }

  if (!VALID_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Only PDF, PNG, JPG files are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: "File size must be under 10MB.",
    };
  }

  return { valid: true };
}
