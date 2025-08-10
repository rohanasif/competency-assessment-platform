import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock database - replace with actual database
const mockAssessments: any[] = []
const mockUserProgress: any[] = []

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    const { step, answers, score, timeSpent } = await request.json()

    // Validation
    if (!step || !answers || score === undefined) {
      return NextResponse.json({ message: "Step, answers, and score are required" }, { status: 400 })
    }

    // Calculate level based on step and score
    let level = ""
    let status: "passed" | "failed" = "failed"
    let canProceed = false
    let certificateEarned = false

    if (step === 1) {
      if (score < 25) {
        status = "failed"
        level = "Failed"
      } else if (score >= 25 && score < 50) {
        status = "passed"
        level = "A1"
        certificateEarned = true
      } else if (score >= 50 && score < 75) {
        status = "passed"
        level = "A2"
        certificateEarned = true
      } else {
        status = "passed"
        level = "A2"
        certificateEarned = true
        canProceed = true
      }
    } else if (step === 2) {
      if (score < 25) {
        status = "passed"
        level = "A2" // Remain at A2
      } else if (score >= 25 && score < 50) {
        status = "passed"
        level = "B1"
        certificateEarned = true
      } else if (score >= 50 && score < 75) {
        status = "passed"
        level = "B2"
        certificateEarned = true
      } else {
        status = "passed"
        level = "B2"
        certificateEarned = true
        canProceed = true
      }
    } else if (step === 3) {
      if (score < 25) {
        status = "passed"
        level = "B2" // Remain at B2
      } else if (score >= 25 && score < 50) {
        status = "passed"
        level = "C1"
        certificateEarned = true
      } else {
        status = "passed"
        level = "C2"
        certificateEarned = true
      }
    }

    // Create assessment record
    const assessment = {
      id: Date.now().toString(),
      userId: decoded.userId,
      step,
      answers,
      score,
      level,
      status,
      timeSpent,
      completedAt: new Date().toISOString(),
    }

    mockAssessments.push(assessment)

    // Update user progress
    let userProgress = mockUserProgress.find((p) => p.userId === decoded.userId)
    if (!userProgress) {
      userProgress = {
        userId: decoded.userId,
        currentLevel: level,
        currentStep: step === 1 && status === "failed" ? 1 : canProceed ? step + 1 : step,
        completedSteps: [],
        failedAtStep1: step === 1 && status === "failed",
        certificates: [],
        lastAssessmentDate: new Date().toISOString(),
      }
      mockUserProgress.push(userProgress)
    }

    // Update progress
    if (status === "passed") {
      if (!userProgress.completedSteps.includes(step)) {
        userProgress.completedSteps.push(step)
      }
      userProgress.currentLevel = level
      if (canProceed) {
        userProgress.currentStep = step + 1
      }
      if (certificateEarned && !userProgress.certificates.includes(level)) {
        userProgress.certificates.push(level)
      }
    } else if (step === 1) {
      userProgress.failedAtStep1 = true
    }

    userProgress.lastAssessmentDate = new Date().toISOString()

    return NextResponse.json({
      message: "Assessment submitted successfully",
      assessment: {
        id: assessment.id,
        step,
        score,
        level,
        status,
        canProceed,
        certificateEarned,
      },
    })
  } catch (error) {
    console.error("Assessment submission error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
