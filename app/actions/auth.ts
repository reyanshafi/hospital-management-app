"use server"

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const User = require("@/models/User");
// @ts-ignore
const Patient = require("@/models/Patient");
// @ts-ignore
const Doctor = require("@/models/Doctor");
import bcrypt from "bcryptjs";

export async function loginUser(formData: FormData) {
  console.log("User model:", User);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "admin" | "doctor" | "patient";

  if (!email || !password || !role) {
    return { error: "Please fill in all fields" };
  }

  await connectToDatabase();
  let userDoc;
  
  try {
    if (role === "admin") {
      userDoc = await User.findOne({ email, role }).select('+password');
    } else if (role === "patient") {
      userDoc = await Patient.findOne({ email }).select('+password');
      if (userDoc) userDoc.role = "patient";
    } else if (role === "doctor") {
      userDoc = await Doctor.findOne({ email }).select('+password');
      if (userDoc) userDoc.role = "doctor";
    }

    console.log('User found:', userDoc ? { id: userDoc._id, role: userDoc.role } : 'Not found');

    if (!userDoc) {
      return { error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return { error: "Invalid email or password" };
    }

    // Create session data with _id included (this is crucial!)
    const sessionData = {
      user: {
        _id: userDoc._id.toString(), // Add the missing _id field
        email: userDoc.email,
        name: userDoc.name || `${userDoc.firstName} ${userDoc.lastName}`,
        role: userDoc.role,
      },
    };

    console.log('Creating session for:', sessionData.user);

    // Set cookie - Remove httpOnly so frontend can access it
    const cookieStore = await cookies();
    cookieStore.set(
      "session",
      JSON.stringify(sessionData),
      {
        httpOnly: false, // Change this so frontend can access the cookie
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/", // Ensure cookie is available site-wide
      },
    );

    console.log('Login successful for role:', userDoc.role);

    // Return role and user data for client-side redirect
    return { 
      success: true, 
      role: userDoc.role,
      user: sessionData.user // Include user data in response
    };

  } catch (error) {
    console.error('Login error:', error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
