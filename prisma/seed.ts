
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@plugplayers.dev';
  const clientEmail = 'client@plugplayers.dev';
  const jobEmail = 'job@plugplayers.dev';

  const adminPass = await bcrypt.hash('admin123', 10);
  const clientPass = await bcrypt.hash('client123', 10);
  const jobPass = await bcrypt.hash('job123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: 'Admin', role: Role.ADMIN, hashedPassword: adminPass },
    update: {}
  });
  await prisma.user.upsert({
    where: { email: clientEmail },
    create: { email: clientEmail, name: 'Client', role: Role.CLIENT, hashedPassword: clientPass },
    update: {}
  });
  await prisma.user.upsert({
    where: { email: jobEmail },
    create: { email: jobEmail, name: 'Jobseeker', role: Role.JOBSEEKER, hashedPassword: jobPass },
    update: {}
  });
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
