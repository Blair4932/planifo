import prisma from "@/prisma/lib/prisma";

class SessionHandler {
  static async createSession(user: any) {
    try {
      const session = await prisma.session.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1-day expiry
        },
      });

      return session.id;
    } catch (error) {
      console.error("Error creating session:", error.message, error.stack);
      throw new Error("Failed to create session");
    }
  }

  static handleRelatedData(data: any) {
    return data ? { create: data } : { create: [] };
  }

  static async validateSession(sessionId: string) {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: {
          user: true,
        },
      });

      if (!session || new Date() >= session.expiresAt) {
        console.log("SESSION", session);
        await this.deleteSession(sessionId);
        return await this.validateSession(sessionId);
      }

      return session.user;
    } catch (error) {
      console.error("Error validating session:", error.message, error.stack);
      throw new Error("Failed to validate session");
    }
  }

  static async deleteSession(sessionId: string) {
    try {
      await prisma.session.delete({
        where: { id: sessionId },
      });
    } catch (error) {
      console.error("Error deleting session:", error.message, error.stack);
      throw new Error("Failed to delete session");
    }
  }
}

export default SessionHandler;
