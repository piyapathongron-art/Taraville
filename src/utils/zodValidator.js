
import z from 'zod';
// for reqired field
export const requiredString = (input) => {
  return z.string({}).min(1, `${input} is required`);
};

export const requiredNumber = (input) => {
  return z.number({}).min(1, `${input} is required`);
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

export const OwnerPhoneValidator = z.string()
  .regex(/^[0-9]*$/, "Phone must contain only numbers")
  .min(9, "Phone must be at least 9 numbers")
  .max(10, "Phone maximum 10 numbers")
  .optional()
  .or(z.literal(""))
  .nullable();

export const emailValidator = z.email("Invalid email format")
  .optional()
  .or(z.literal(""));

export const urlValidator = z.url("Invalid URL format")
  .optional()
  .or(z.literal(""));

//params id check
export const idParamsValidator = z.coerce
  .string()
  .max(10, "ID ต้องมีความยาวไม่เกิน 10 ตัวอักษร") 
  .transform((val) => Number(val)) 
  .refine((val) => !isNaN(val), { message: "ID ต้องเป็นตัวเลขเท่านั้น" })
  .refine((val) => Number.isInteger(val), { message: "ID ต้องเป็นจำนวนเต็ม" })
  .refine((val) => val > 0, { message: "ID ต้องมากกว่า 0" });

  //params for houseImage
  export const imageIdParamsValidator = z.coerce
  .string()
  .max(10, "ID ต้องมีความยาวไม่เกิน 10 ตัวอักษร") 
  .transform((val) => Number(val)) 
  .refine((val) => !isNaN(val), { message: "ID ต้องเป็นตัวเลขเท่านั้น" })
  .refine((val) => Number.isInteger(val), { message: "ID ต้องเป็นจำนวนเต็ม" })
  .refine((val) => val > 0, { message: "ID ต้องมากกว่า 0" })
  .optional();