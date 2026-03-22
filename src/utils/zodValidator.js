
import z from 'zod';
// for reqired field
export const requiredString = (input) => {
  return z.string({}).min(1, `${input} is required`);
};

// for optional field
export const optionalString = z.string().optional();
export const optionalNumberString = z.string().optional(); 
export const optionalDateString = z.string().optional();   

// constant validator
export const passwordValidator = z.string().min(4, "Password must be at least 4 characters");

export const phoneValidator = z.string()
  .min(9, "Phone must be at least 9 numbers")
  .max(10, "Phone maximum 10 numbers");

export const emailValidator = z.email("Invalid email format")
  .optional()
  .or(z.literal(""));

export const urlValidator = z.url("Invalid URL format")
  .optional()
  .or(z.literal(""));

//params id check
export const idParamsValidator = z.coerce
  .number({
   error: "ID must be number"
  })
  .int("ID integer")
  .positive("ID must be above 0")
  .max(10, "ID too long");