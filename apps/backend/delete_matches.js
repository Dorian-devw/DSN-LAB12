const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.match.deleteMany({});
  await prisma.team.deleteMany({});
  console.log('Deleted all matches and teams');
}
run();
