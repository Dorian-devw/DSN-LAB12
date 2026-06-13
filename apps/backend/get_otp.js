const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const latest = await prisma.otpCode.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  console.log('LATEST OTP:', latest?.otpCode);
}
main().finally(() => prisma.$disconnect());
