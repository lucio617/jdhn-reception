// pages/api/auth.ts
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("Post hit")
    const { userId, password } = req.body;
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) return res.status(401).json({ error: "Invalid credentialsu" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: "Invalid credentialsv" });

    const token = await signToken({
      id: user.id,
      role: user.role,
      userId: user.userId,
    });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`
    );

    let redirectPath = "/login";
    if (user.role === "ADMIN" || user.role === "RECEPTIONIST") {
      redirectPath = "/dashboard/appointments";
    }

    return res.status(200).json({
      message: "Logged in successfully",
      redirectPath,
    });
  } else {
    // 👇 Handle unsupported methods explicitly
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
