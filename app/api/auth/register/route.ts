import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Mock database - replace with actual database
const mockUsers: any[] = []
const mockOTPs: any[] = []

// Mock email service
const sendOTPEmail = async (email: string, otp: string) => {
  console.log(`Sending OTP ${otp} to ${email}`)
  // In production, integrate with actual email service like Nodemailer, SendGrid, etc.
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Create user (unverified)
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "student",
      isVerified: false,
      createdAt: new Date().toISOString(),
    }

    // Store user and OTP
    mockUsers.push(newUser)
    mockOTPs.push({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    })

    // Send OTP email
    await sendOTPEmail(email, otp)

    return NextResponse.json({
      message: "Registration successful. Please check your email for verification code.",
      userId: newUser.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
