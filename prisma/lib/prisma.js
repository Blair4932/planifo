import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

console.log("Prisma client initialized:", prisma.event); // Debugging log
export default prisma;
