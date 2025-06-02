import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const currentUser = getUserFromRequest(req);
  if (!currentUser || currentUser.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    const receptionists = await prisma.user.findMany({
      where: { role: "RECEPTIONIST" }, 
      select: { id: true, userId: true, createdAt: true },
    });

    return res.status(200).json(receptionists);
  } else if (req.method === "POST") {
    const { userId, password } = req.body;
    if (!userId || !password)
      return res.status(400).json({ error: "Missing userId or password" });

    const existing = await prisma.user.findUnique({ where: { userId } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { userId, passwordHash, role: "RECEPTIONIST" },
      select: { id: true, userId: true },
    });

    return res.status(201).json(newUser);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "Missing id" });

    await prisma.user.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
