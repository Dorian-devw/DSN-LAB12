const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.match.findFirst().then(m => {
  console.log(m);
  prisma.$disconnect();
});
