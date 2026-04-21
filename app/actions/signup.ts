"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResult {
  success: boolean;
  error?: string;
}

function generateUsername(email: string) {
  return email.split("@")[0] + "_" + Math.floor(1000 + Math.random() * 9000);
}

export async function signupAction(
  input: SignupInput
): Promise<SignupResult> {
  try {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;
    const confirmPassword = input.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: "All fields are required." };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match." };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long.",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    let username = generateUsername(email);

    while (await prisma.user.findUnique({ where: { username } })) {
      username = generateUsername(email);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        username,
        passwordHash,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[signupAction] Error:", error);
    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
}