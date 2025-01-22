import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function main() {
  const user = await prisma.user.create({
    data: { name: "test", password: "password", email: "test@manifo.uk" },
  });
}

main();
export default prisma;
