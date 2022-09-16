import { PrismaClient, User } from '@prisma/client';

const prismaClient = new PrismaClient();

export default async function userSeed() {
  try {
    await prismaClient.user.create({
      data: {
        email: 'oi',
        password: 'oi',
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}
