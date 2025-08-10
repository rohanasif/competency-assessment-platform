import { type NextRequest, NextResponse } from "next/server"

// Mock databases - replace with actual database
const mockUsers: any[] = []
const mockOTPs: any[] = []

// Mock email service
const sendOTPEmail = async (email: string, otp: string) => {
  console.log(`Resending OTP ${otp} to ${email}`)
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json({ message: "User is already verified" }, { status: 400 })
    }

    // Remove existing OTP for this email
    const existingOTPIndex = mockOTPs.findIndex((record) => record.email === email)
    if (existingOTPIndex > -1) {
      mockOTPs.splice(existingOTPIndex, 1)
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store new OTP
    mockOTPs.push({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    })

    // Send OTP email
    await sendOTPEmail(email, otp)

    return NextResponse.json({
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
