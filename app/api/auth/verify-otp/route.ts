import { type NextRequest, NextResponse } from "next/server"

// Mock databases - replace with actual database
const mockUsers: any[] = []
const mockOTPs: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    // Validation
    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 })
    }

    // Find OTP record
    const otpRecord = mockOTPs.find((record) => record.email === email && record.otp === otp)

    if (!otpRecord) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 })
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 })
    }

    // Find and verify user
    const userIndex = mockUsers.findIndex((u) => u.email === email)
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Update user verification status
    mockUsers[userIndex].isVerified = true

    // Remove used OTP
    const otpIndex = mockOTPs.findIndex((record) => record.email === email && record.otp === otp)
    if (otpIndex > -1) {
      mockOTPs.splice(otpIndex, 1)
    }

    return NextResponse.json({
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
