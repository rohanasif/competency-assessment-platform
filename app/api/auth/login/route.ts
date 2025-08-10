import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Mock user database - replace with actual database
const mockUsers = [
  {
    id: "1",
    email: "admin@testschool.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    isVerified: true,
  },
  {
    id: "2",
    email: "student@testschool.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // student123
    firstName: "Student",
    lastName: "User",
    role: "student",
    isVerified: true,
  },
  {
    id: "3",
    email: "supervisor@testschool.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // supervisor123
    firstName: "Supervisor",
    lastName: "User",
    role: "supervisor",
    isVerified: true,
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    )

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    )

    // Return success response
    return NextResponse.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
