import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma.js";
import bcrypt from 'bcrypt';

const hashedPassword = () => bcrypt.hashSync('123456', 8);

// ==========================================
// 1. Mock Data: Employees
// ==========================================
const employeeData = Array.from({ length: 10 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  // จำกัดความยาว 10 ตัวอักษรให้ตรงกับ @db.VarChar(10)
  phone: faker.string.numeric(10), 
  email: faker.internet.email(),
  department: faker.helpers.arrayElement(['Sale', 'Engineer', 'Staff', 'Employee']),
  salary: faker.commerce.price({ min: 15000, max: 80000 }),
  address: faker.location.streetAddress(),
}));

// ==========================================
// 2. Mock Data: Users (เชื่อมกับ Employee)
// ==========================================
const userData = [
  { empId: 1, password: hashedPassword(), role: "Admin" },
  { empId: 2, password: hashedPassword(), role: "Staff" },
  { empId: 3, password: hashedPassword(), role: "User" },
  { empId: 4, password: hashedPassword(), role: "User" },
  { empId: 5, password: hashedPassword(), role: "User" },
];

// ==========================================
// 3. Mock Data: Houses
// ==========================================
const houseData = Array.from({ length: 10 }).map((_, i) => ({
  houseCode: `A01-${String(i + 1).padStart(2, '0')}`,
  houseName: faker.person.firstName(),
  projectName: "Taraville",
  houseType: faker.helpers.arrayElement(["บ้านเดี่ยว", "บ้านแฝด", "ทาวน์โฮม"]),
  price: faker.commerce.price({ min: 1000000, max: 10000000 }),
  status: faker.helpers.arrayElement(['Available', 'Book', 'Sold', 'Building']),
  details: faker.lorem.paragraph(),
  ownerPhone: faker.string.numeric(10),
}));

// ==========================================
// 4. Mock Data: Customers
// ==========================================
const customerData = Array.from({ length: 15 }).map(() => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phone: faker.string.numeric(10), // @db.VarChar(20)
  lineId: faker.internet.username(),
  email: faker.internet.email(),
  houseNo: faker.location.buildingNumber(),
  street: faker.location.street(),
  subDistrict: "คลองหนึ่ง",
  district: "คลองหลวง",
  province: "ปทุมธานี",
  zipcode: "12120",
  gender: faker.helpers.arrayElement(["ชาย", "หญิง", "ไม่ระบุ"]),
  occupation: faker.person.jobTitle(),
  incomeRange: faker.helpers.arrayElement(["15000-30000", "30000-50000", "50000-100000", "100000+"]),
}));

// ==========================================
// 5. Mock Data: Project Surveys
// ==========================================
const surveyData = Array.from({ length: 15 }).map((_, i) => ({
  customerId: i + 1, // เชื่อมแบบ 1-to-1 กับ Customer (รัน 1 ถึง 15)
  userId: faker.helpers.arrayElement([1, 2, 3, null]), // สุ่มพนักงานที่ดูแล
  surveyType: faker.helpers.arrayElement(['Online', 'Walkin']),
  visitDate: faker.date.recent({ days: 30 }),
  interestedPropertyType: faker.helpers.arrayElement(["บ้านเดี่ยว", "บ้านแฝด", "ทาวน์โฮม"]),
  preferredBedroom: faker.number.int({ min: 1, max: 4 }),
  preferredBathroom: faker.number.int({ min: 1, max: 3 }),
  familySize: faker.helpers.arrayElement(["1-2", "3-4", "5+"]),
  expectedBudget: faker.helpers.arrayElement(["1,000,000-2,000,000", "2,000,000-3,000,000", "3,000,000+"]),
  informationSource: faker.helpers.arrayElement(["Facebook", "ป้ายโฆษณา", "เพื่อนแนะนำ", "Website"]),
  installmentCapacity: faker.helpers.arrayElement(["10000", "15000", "20000", "30000"]),
  remark: faker.lorem.sentence(),
}));

// ==========================================
// 6. Mock Data: Decision Factors
// ==========================================
const decisionFactorsData = [];
for (let i = 1; i <= 15; i++) {
  // สุ่มปัจจัยการตัดสินใจ 1-3 อย่างต่อ 1 Survey
  const factorsCount = faker.number.int({ min: 1, max: 3 });
  for (let j = 0; j < factorsCount; j++) {
    decisionFactorsData.push({
      surveyId: i,
      decisionFactor: faker.helpers.arrayElement(["ทำเลที่ตั้ง", "ราคาและความคุ้มค่า", "สาธารณูปโภค", "คุณภาพ/รูปแบบ"]),
    });
  }
}

// ==========================================
// 7. Mock Data: Assignments
// ==========================================
const assignmentData = Array.from({ length: 20 }).map(() => ({
  houseId: faker.number.int({ min: 1, max: 10 }), // สุ่มบ้านที่สร้างไว้ 10 หลัง
  empId: faker.number.int({ min: 1, max: 10 }), // สุ่มพนักงานที่สร้างไว้ 10 คน
  taskTitle: faker.helpers.arrayElement(["ตัดหญ้าหน้าบ้าน", "ทำความสะอาด", "ตรวจสอบระบบไฟ", "ทาสีรั้ว"]),
  taskDescription: faker.lorem.sentence(),
  dutyRole: faker.person.jobType(),
  assignedDate: faker.date.soon({ days: 10 }),
  status: faker.helpers.arrayElement(['Confirming', 'Pending', 'Complete']),
}));


async function main() {
  console.log('Cleaning up tables...');

  // ดึงชื่อตารางทั้งหมด (ยกเว้นตารางระบบของ Prisma)
  const modelNames = Object.keys(prisma).filter(
    (key) => !key.startsWith('$') && !key.startsWith('_') && key !== 'constructor'
  );
  
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

    for (const name of modelNames) {
      await tx.$executeRawUnsafe(`TRUNCATE TABLE \`${name}\`;`);
    }

    await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  });
  console.log('Tables truncated successfully.');

  console.log('Start seeding...');

  // 1. Employee
  const createEmployee = await prisma.employee.createMany({ data: employeeData });
  console.log(`Created: ${createEmployee.count} employees`);

  // 2. User
  const createdUsers = await prisma.user.createMany({ data: userData });
  console.log(`Created: ${createdUsers.count} users`);

  // 3. House
  const createHouse = await prisma.house.createMany({ data: houseData });
  console.log(`Created: ${createHouse.count} houses`);

  // 4. Customer
  const createCustomer = await prisma.customer.createMany({ data: customerData });
  console.log(`Created: ${createCustomer.count} customers`);

  // 5. Project Survey
  const createSurvey = await prisma.projectSurvey.createMany({ data: surveyData });
  console.log(`Created: ${createSurvey.count} surveys`);

  // 6. Decision Factors
  const createFactors = await prisma.decisionFactors.createMany({ data: decisionFactorsData });
  console.log(`Created: ${createFactors.count} decision factors`);

  // 7. Assignment
  const createAssignment = await prisma.assignment.createMany({ data: assignmentData });
  console.log(`Created: ${createAssignment.count} assignments`);

  console.log('✅ Seeding finished completely!');
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});