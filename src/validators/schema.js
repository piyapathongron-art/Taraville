import { z } from 'zod'
import bcrypt from 'bcrypt'

export const registerSchema = z.object({
  empId: z.string().min(1, "empId required"),
  password: z.string().min(4, "password must more than 4 characters"),
  confirmPassword: z.string().min(1, "confirm password is required")
}).refine(input => input.password === input.confirmPassword, {
  message: "password must match with confirm password",
  path: ['confirmPassword']
}).transform(async data => ({
  empId: Number(data.empId),
  password: bcrypt.hashSync(data.password, 8),
}))

export const loginSchema = z.object({
  empId: z.string().min(1, "empId required"),
  password: z.string().min(4, "password at least 4 characters")
}).transform(data => ({
  empId: data.empId,
  password: data.password
})
)

export const registerSchemaByAdmin = z.object({
  empId: z.string().min(1, "empId required"),
  password: z.string().min(4, "password must more than 4 characters")
}).transform(async data => ({
  empId: Number(data.empId),
  password: bcrypt.hashSync(data.password, 8),
}))