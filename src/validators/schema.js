import { z } from 'zod';
import bcrypt from 'bcrypt';
import { emailValidator, optionalDateString, optionalNumberString, optionalString, OwnerPhoneValidator, passwordValidator, phoneValidator, requiredNumber, requiredString, urlValidator } from '../utils/zodValidator.js';


//Auth Schemas ==========================================
const registerBase = z.object({
  empId: requiredString("empId"),
  password: passwordValidator,
  confirmPassword: requiredString("confirm password"),
  role: z.enum(['User', 'Staff', 'Admin']).optional().default('User')
});

//create
export const registerSchema = registerBase
  .refine(input => input.password === input.confirmPassword, {
    message: "Password must match with confirm password",
    path: ['confirmPassword']
  })
  .transform(async data => ({
    empId: Number(data.empId),
    password: bcrypt.hashSync(data.password, 8),
    role: data.role
  }));

  //create by admin
  export const registerSchemaAdmin = z.object({
    empId: requiredString("empId"),
    password: passwordValidator,
    role: z.enum(['User','Staff','Admin']).optional().default("User")
  }).transform(async data =>({
    empId: +data.empId,
    password: bcrypt.hashSync(data.password,8),
    role: data.role    
  }))
  

  //login
export const loginSchema = z.object({
  empId: requiredString("employeeId"),
  password: passwordValidator
});

//Employee Schemas ==========================================
const employeeBase = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  phone: phoneValidator,
  email: emailValidator,
  department: z.enum(['Sale', 'Engineer', 'Staff', 'Employee']).optional(),
  salary: optionalNumberString,
  address: optionalString,
  imageUrl: urlValidator
});

//create
export const createEmployeeSchema = employeeBase.transform(data => ({
  ...data,
  salary: data.salary ? Number(data.salary) : undefined
}));

//update
export const updateEmployeeSchema = employeeBase.partial().transform(data => ({
  ...data,
  salary: data.salary ? Number(data.salary) : undefined
}));

//House Schemas ==========================================
const houseBase = z.object({
  houseCode: requiredString("House code"),
  houseName: optionalString,
  projectName: optionalString,
  houseType: optionalString,
  price: optionalNumberString,
  status: z.enum(['Available', 'Book', 'Sold', 'Repair', 'Building']).optional().default("Available"),
  details: optionalString,
  ownerPhone : OwnerPhoneValidator
});

// create
export const createHouseSchema = houseBase.transform(data => ({
  ...data,
  price: data.price ? Number(data.price) : undefined
}));

//update
export const updateHouseSchema = houseBase.partial().transform(data => ({
  ...data,
  price: data.price ? Number(data.price) : undefined
}));

export const houseImageSchema = z.object({
  imageUrl: urlValidator,
  isCover: z.boolean().optional().default(false)
}).transform(data =>({
  imageUrl: data.imageUrl,
  isCover: data.isCover
}));

export const updateHouseImagesSchema = z.object({
  images: z.array(z.url("Must be a valid URL")).default([])
});

//Assignment Schemas ==========================================
const assignmentBase = z.object({
  houseId: requiredNumber("houseId"),
  empId: requiredNumber("empId"),
  taskTitle: requiredString("Task title"),
  taskDescription: optionalString,
  dutyRole: optionalString,
  assignedDate: optionalDateString,
  status: z.enum(['Confirming', 'Pending', 'Complete']).optional().default("Pending")
});

//create
export const createAssignmentSchema = assignmentBase.transform(data => ({
  ...data,
  houseId: Number(data.houseId),
  empId: Number(data.empId),
  assignedDate: data.assignedDate ? new Date(data.assignedDate) : undefined
}));

//update
export const updateAssignmentSchema = assignmentBase.partial().transform(data => ({
  ...data,
  houseId: data.houseId ? Number(data.houseId) : undefined,
  empId: data.empId ? Number(data.empId) : undefined,
  assignedDate: data.assignedDate ? new Date(data.assignedDate) : undefined
}));

//Customer ==========================================
const customerBase = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  phone: phoneValidator,
  lineId: optionalString,
  email: emailValidator,
  houseNo: optionalString,
  street: optionalString,
  subDistrict: optionalString,
  district: optionalString,
  province: optionalString,
  zipcode: optionalString,
  gender: optionalString,
  occupation: optionalString,
  incomeRange: optionalString
});

//create
export const createCustomerSchema = customerBase;
//update
export const updateCustomerSchema = customerBase.partial();

//survey Schemas ==========================================
const surveyBase = z.object({
  customerId: requiredString("customerId"),
  userId: optionalNumberString,
  visitDate: optionalDateString,
  interestedPropertyType: optionalString,
  preferredBedroom: optionalNumberString,
  preferredBathroom: optionalNumberString,
  decisionFactors: z.array(z.string()).optional(), 
  familySize: optionalString,
  expectedBudget: optionalString,
  informationSource: optionalString,
  installmentCapacity: optionalString,
  remark:optionalString,
  otherNewsChannel:optionalString,
  surveyType: z.enum(['Online', 'Walkin']).optional().default("Online")
});

//create
export const createSurveySchema = surveyBase.transform(data => ({
  ...data,
  customerId: Number(data.customerId),
  userId: data.userId ? Number(data.userId) : undefined,
  visitDate: data.visitDate ? new Date(data.visitDate) : undefined,
  preferredBedroom: data.preferredBedroom ? Number(data.preferredBedroom) : undefined,
  preferredBathroom: data.preferredBathroom ? Number(data.preferredBathroom) : undefined,
}));

//update
export const updateSurveySchema = surveyBase.partial().transform(data => ({
  ...data,
  customerId: data.customerId ? Number(data.customerId) : undefined,
  userId: data.userId ? Number(data.userId) : undefined,
  visitDate: data.visitDate ? new Date(data.visitDate) : undefined,
  preferredBedroom: data.preferredBedroom ? Number(data.preferredBedroom) : undefined,
  preferredBathroom: data.preferredBathroom ? Number(data.preferredBathroom) : undefined,
}));