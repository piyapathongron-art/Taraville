import { fakerTH as faker } from "@faker-js/faker"; // ใช้ fakerTH เพื่อให้ได้ชื่อภาษาไทย
import bcrypt from 'bcrypt';
import { prisma } from "../src/lib/prisma.js";


const hashedPassword = () => bcrypt.hashSync('123456', 8);

async function main() {
  console.log('🧹 Cleaning up tables...');

  // ดึงชื่อตารางทั้งหมด (ยกเว้นตารางระบบของ Prisma)
  const modelNames = Object.keys(prisma).filter(
    (key) => !key.startsWith('$') && !key.startsWith('_') && key !== 'constructor'
  );
  
  // Truncate ตารางทั้งหมดเพื่อรีเซ็ต ID เริ่มต้นที่ 1 ใหม่
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    for (const name of modelNames) {
      await tx.$executeRawUnsafe(`TRUNCATE TABLE \`${name}\`;`);
    }
    await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  });
  console.log('✨ Tables truncated successfully.');

  console.log('🌱 Start seeding...');

  // ==========================================
  // 1. Employee
  // ==========================================
  const employeeData = Array.from({ length: 10 }).map((_, i) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.string.numeric(10), 
    email: `emp${String(i + 1).padStart(3, '0')}@taraville.com`, 
    department: faker.helpers.arrayElement(['Sale', 'Engineer', 'Staff', 'Employee']),
    salary: faker.number.int({ min: 15000, max: 80000 }),
    address: faker.location.streetAddress(),
  }));
  const createEmployee = await prisma.employee.createMany({ data: employeeData });
  console.log(`👨‍💼 Created: ${createEmployee.count} employees`);

  // ==========================================
  // 2. User 
  // (userId เป็น Autoincrement จึงไม่ต้องใส่ค่า ระบบจะรันให้เอง)
  // ==========================================
  const userData = [
    { empId: 1, password: hashedPassword(), role: "Admin" },
    { empId: 2, password: hashedPassword(), role: "Staff" },
    { empId: 3, password: hashedPassword(), role: "User" },
    { empId: 4, password: hashedPassword(), role: "User" },
    { empId: 5, password: hashedPassword(), role: "User" },
  ];
  const createdUsers = await prisma.user.createMany({ data: userData });
  console.log(`🔐 Created: ${createdUsers.count} users`);

  // ดึง User ออกมาเพื่อเอา userId (Int) ไปใช้เชื่อมกับ Project Survey
  const allUsers = await prisma.user.findMany();
  const userIds = allUsers.map(u => u.userId);

  // ==========================================
  // 3. House & HouseImage (20 หลัง)
  // ==========================================
  const houseData = Array.from({ length: 20 }).map((_, i) => ({
    houseCode: `A01-${String(i + 1).padStart(2, '0')}`,
    houseName: `Taraville Model ${String.fromCharCode(65 + (i % 5))}`, // Model A, B, C...
    projectName: "Taraville",
    houseType: faker.helpers.arrayElement(["บ้านเดี่ยว", "บ้านแฝด", "ทาวน์โฮม"]),
    price: faker.number.int({ min: 2000000, max: 8000000 }),
    status: faker.helpers.arrayElement(['Available', 'Book', 'Sold', 'Building', 'Repair']),
    details: faker.lorem.paragraph(2),
    ownerPhone: faker.string.numeric(10),
  }));
  const createHouse = await prisma.house.createMany({ data: houseData });
  console.log(`🏠 Created: ${createHouse.count} houses`);

  // สร้างรูปภาพบ้าน (หลังละ 2 รูป)
  const houseImageData = [];
  for (let i = 1; i <= 20; i++) {
      houseImageData.push({
          houseId: i,
          imageUrl: `https://res.cloudinary.com/dc8ywsgsf/image/upload/v1774706159/ctbztocwqolp9znzaz2t.jpg`,
          isCover: true
      });
      houseImageData.push({
          houseId: i,
          imageUrl: `https://res.cloudinary.com/dc8ywsgsf/image/upload/v1774706217/tngzdvbzcfpitfkhjxme.jpg`,
          isCover: false
      });
  }
  await prisma.houseImage.createMany({ data: houseImageData });
  console.log(`🖼️ Created: ${houseImageData.length} house images`);

  // ==========================================
  // 4. Customer
  // ==========================================
  const customerData = Array.from({ length: 15 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.string.numeric(10),
    lineId: faker.internet.username().substring(0, 40), // แก้ไข: จำกัดความยาวไม่ให้เกิน 50 ตัวอักษร
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
  const createCustomer = await prisma.customer.createMany({ data: customerData });
  console.log(`👥 Created: ${createCustomer.count} customers`);

  // ==========================================
  // 5. Project Survey
  // ==========================================
  const surveyData = Array.from({ length: 15 }).map((_, i) => ({
    customerId: i + 1, // เชื่อมแบบ 1-to-1 กับ Customer (รัน 1 ถึง 15)
    userId: faker.helpers.arrayElement([...userIds, null]), // สุ่มดึง userId แบบ Int หรือ null
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
  const createSurvey = await prisma.projectSurvey.createMany({ data: surveyData });
  console.log(`📋 Created: ${createSurvey.count} surveys`);

  // ==========================================
  // 6. Decision Factors
  // ==========================================
  const decisionFactorsData = [];
  for (let i = 1; i <= 15; i++) {
    const factorsCount = faker.number.int({ min: 1, max: 3 }); // สุ่ม 1-3 อย่าง
    for (let j = 0; j < factorsCount; j++) {
      decisionFactorsData.push({
        surveyId: i,
        decisionFactor: faker.helpers.arrayElement(["ทำเลที่ตั้ง", "ราคาและความคุ้มค่า", "สาธารณูปโภค", "คุณภาพ/รูปแบบ"]),
      });
    }
  }
  const createFactors = await prisma.decisionFactors.createMany({ data: decisionFactorsData });
  console.log(`📌 Created: ${createFactors.count} decision factors`);

  // ==========================================
  // 7. Assignments
  // ==========================================
  const assignmentData = Array.from({ length: 20 }).map((_, i) => ({
    houseId: (i % 20) + 1, // กระจายให้บ้าน 20 หลัง
    empId: faker.number.int({ min: 1, max: 10 }), // สุ่มพนักงาน
    taskTitle: faker.helpers.arrayElement(["ตัดหญ้าหน้าบ้าน", "ทำความสะอาด", "ตรวจสอบระบบไฟ", "ทาสีรั้ว"]),
    taskDescription: faker.lorem.sentence(),
    dutyRole: faker.helpers.arrayElement(["วิศวกร", "ช่างเทคนิค", "พนักงานดูแลความสะอาด"]),
    assignedDate: faker.date.soon({ days: 10 }),
    status: faker.helpers.arrayElement(['Confirming', 'Pending', 'Complete']),
  }));
  const createAssignment = await prisma.assignment.createMany({ data: assignmentData });
  console.log(`✅ Created: ${createAssignment.count} assignments`);

  console.log('🎉 Seeding finished completely!');
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});