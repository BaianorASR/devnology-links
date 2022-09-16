import userSeed from './seeds/user.seed';

async function seed() {
  try {
    await userSeed();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
seed();
