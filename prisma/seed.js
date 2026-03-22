import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma.js";
import bcrypt from 'bcrypt'

const hashedPassword = () => bcrypt.hashSync('123456', 8)

const employeeData = [
    {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
    },
    {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
    },
    {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
    },
    {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
    },
    {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
    },
    {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
    },
]


const userData = [
  {
    empId: 1, password: hashedPassword(),role: "Admin"
  },
  {
    empId: 2, password: hashedPassword()
  },
  {
    empId: 3, password: hashedPassword()
  },
  {
    empId: 4, password: hashedPassword()
  },
  {
    empId: 5, password: hashedPassword()
  },
]

const houseData = [
    {
        houseCode: "A01-01",
        houseName: faker.person.firstName(),
        projectName: "Taraville",
        houseType: "บ้านเดี่ยว",
        price: faker.commerce.price({min:1000000, max:10000000}),
    },
    {
        houseCode: "A01-02",
        houseName: faker.person.firstName(),
        projectName: "Taraville",
        houseType: "บ้านเดี่ยว",
        price: faker.commerce.price({min:1000000, max:10000000}),
    },
    {
        houseCode: "A01-03",
        houseName: faker.person.firstName(),
        projectName: "Taraville",
        houseType: "บ้านเดี่ยว",
        price: faker.commerce.price({min:1000000, max:10000000}),
    },
    {
        houseCode: "A01-04",
        houseName: faker.person.firstName(),
        projectName: "Taraville",
        houseType: "บ้านเดี่ยว",
        price: faker.commerce.price({min:1000000, max:10000000}),
    },
    {
        houseCode: "A01-05",
        houseName: faker.person.firstName(),
        projectName: "Taraville",
        houseType: "บ้านเดี่ยว",
        price: faker.commerce.price({min:1000000, max:10000000}),
    },
    {
        houseCode: "A01-06",
        houseName: faker.person.firstName(),
        projectName: "Taraville",
        houseType: "บ้านเดี่ยว",
        price: faker.commerce.price({min:1000000, max:10000000}),
    },
]


async function main() {
  console.log('Clean table...')

  const modelNames = Object.keys(prisma).filter(
    (key) => !key.startsWith('$') && !key.startsWith('_') && key !== 'constructor'
  );
  console.log(modelNames)

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

    for (const name of modelNames) {
      // ใช้ Backticks ครอบชื่อเสมอเพื่อความชัวร์
      await tx.$executeRawUnsafe(`TRUNCATE TABLE \`${name}\`;`);
    }

    await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  });

  console.log('Start seeding...')
  const createEmployee = await prisma.employee.createMany({
    data: employeeData,
    skipDuplicates: true
  })

  const createdUsers = await prisma.user.createMany({
    data: userData,
    skipDuplicates: true,
  })

  const createHouse =await prisma.house.createMany({
    data: houseData,
    skipDuplicates: true
  })

  console.log(`create employee success`)
  console.log(`Created : ${createEmployee.count} users`)
  console.log(`create user success`)
  console.log(`Created : ${createdUsers.count} users`)
  console.log(`create house success`)
  console.log(`Created : ${createHouse.count} users`)
}

main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
