import { prisma } from "@/lib/db";

const DEFAULT_USER_EMAIL = "team@pop-generator.local";

// Returns the shared team user, creating it on first call.
// Used for document set ownership now that authentication has been removed.
export async function getOrCreateDefaultUser() {
  const existing = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
  });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email: DEFAULT_USER_EMAIL,
      name: "Team",
      passwordHash: "",
      role: "admin",
    },
  });
}
