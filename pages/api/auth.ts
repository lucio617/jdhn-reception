import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "../../lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentialsu" });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: "Invalid credentialsv" });

    const token = await signToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    // Use serialized cookie and redirect to dashboard
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`
    );
    let redirectPath = "/login";
    if (user.role === "ADMIN") {
      redirectPath = "/dashboard/appointments";
    } else if (user.role === "RECEPTIONIST") {
      redirectPath = "/dashboard/appointments";
    }

    return res.status(200).json({
      message: "Logged in successfully",
      redirectPath,
    });
  } else {
    console.log("Received login GET request")
    res.end();
  }
}
