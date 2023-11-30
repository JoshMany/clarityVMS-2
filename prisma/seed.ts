import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = [
    { id: 1, name: "Administrator" },
    { id: 2, name: "Supervisor" },
    { id: 3, name: "User" },
  ];
  const users = [
    {
      UUID: "b9239313-4a7f-11ee-a6f1-107b44180557",
      Email: "admin@test.com",
      UserName: "AdminTest",
      Password: "TestCase",
      role_id: 1,
    },
    {
      UUID: "9f9c9038-4a80-11ee-a6f1-107b44180557",
      Email: "user@test.com",
      UserName: "TestUser",
      Password: "UserTest",
      role_id: 3,
    },
    {
      UUID: "e3bb2c8a-511a-11ee-b1e0-107b44180557",
      Email: "jobreq@test.com",
      UserName: "JobReq User",
      Password: "TestCase",
      role_id: 2,
    },
  ];
  const dashboards = [
    {
      uuid: "54544944-81ac-11ee-ac85-107b44180557",
      dashboard_name: "Dashboard 2",
      owner_id: "b9239313-4a7f-11ee-a6f1-107b44180557",
      created_at: new Date("2023-11-12T22:39:22Z"),
      updated_at: new Date("2023-11-12T22:39:22Z"),
    },
    {
      uuid: "771e99f4-81ac-11ee-ac85-107b44180557",
      dashboard_name: "Dashboard Prueba",
      owner_id: "b9239313-4a7f-11ee-a6f1-107b44180557",
      created_at: new Date("2023-11-12T22:40:21Z"),
      updated_at: new Date("2023-11-12T22:40:21Z"),
    },
  ];

  for (let role of roles) {
    await prisma.roles.create({
      data: role,
    });
  }
  for (let user of users) {
    await prisma.users.create({
      data: user,
    });
  }
  for (let dashboard of dashboards) {
    await prisma.dashboards.create({
      data: dashboard,
    });
  }
}
main()
  .then(async () => {
    console.log("Seeder Done!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
