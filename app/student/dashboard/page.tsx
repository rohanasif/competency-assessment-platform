"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface UserProgress {
  currentLevel: string
  currentStep: number
  completedSteps: number[]
  failedAtStep1: boolean
  certificates: string[]
  lastAssessmentDate?: string
}

interface AssessmentHistory {
  id: string
  step: number
  score: number
  level: string
  completedAt: string
  status: "passed" | "failed"
}

export default function StudentDashboard() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentLevel: "Not Started",
    currentStep: 1,
    completedSteps: [],
    failedAtStep1: false,
    certificates: [],
    lastAssessmentDate: undefined,
  })
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserProgress()
    fetchAssessmentHistory()
  }, [])

  const fetchUserProgress = async () => {
    try {
      // Mock data - replace with actual API call
      setUserProgress({
        currentLevel: "A2",
        currentStep: 2,
        completedSteps: [1],
        failedAtStep1: false,
        certificates: ["A1", "A2"],
        lastAssessmentDate: "2025-01-08",
      })
    } catch (error) {
      console.error("Failed to fetch user progress:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAssessmentHistory = async () => {
    try {
      // Mock data - replace with actual API call
      setAssessmentHistory([
        {
          id: "1",
          step: 1,
          score: 78,
          level: "A2",
          completedAt: "2025-01-08T10:30:00Z",
          status: "passed",
        },
      ])
    } catch (error) {
      console.error("Failed to fetch assessment history:", error)
    }
  }

  const getStepStatus = (step: number) => {
    if (userProgress.completedSteps.includes(step)) {
      return "completed"
    } else if (step === userProgress.currentStep && !userProgress.failedAtStep1) {
      return "available"
    } else if (step === 1 && userProgress.failedAtStep1) {
      return "failed"
    } else {
      return "locked"
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Basic digital literacy (A1 & A2 levels)"
      case 2:
        return "Intermediate competencies (B1 & B2 levels)"
      case 3:
        return "Advanced expertise (C1 & C2 levels)"
      default:
        return ""
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
      case "A2":
        return "bg-green-100 text-green-800"
      case "B1":
      case "B2":
        return "bg-blue-100 text-blue-800"
      case "C1":
      case "C2":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Test_School</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Student</span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your digital competency assessment progress</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.currentLevel}</div>
              <p className="text-xs text-muted-foreground">{userProgress.certificates.length} certificate(s) earned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((userProgress.completedSteps.length / 3) * 100)}%</div>
              <Progress value={(userProgress.completedSteps.length / 3) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Step</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.failedAtStep1 ? "Blocked" : `Step ${userProgress.currentStep}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {userProgress.failedAtStep1 ? "Failed at Step 1" : "Ready to take"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Steps</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((step) => {
                const status = getStepStatus(step)
                return (
                  <Card
                    key={step}
                    className={`${status === "completed" ? "border-green-200 bg-green-50" : status === "failed" ? "border-red-200 bg-red-50" : status === "available" ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Step {step}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                          {status === "available" && <Play className="h-5 w-5 text-blue-600" />}
                          {status === "locked" && <AlertCircle className="h-5 w-5 text-gray-400" />}
                          <Badge
                            variant={
                              status === "completed"
                                ? "default"
                                : status === "failed"
                                  ? "destructive"
                                  : status === "available"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {status === "completed"
                              ? "Completed"
                              : status === "failed"
                                ? "Failed"
                                : status === "available"
                                  ? "Available"
                                  : "Locked"}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{getStepDescription(step)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {status === "available" && (
                        <Link href={`/student/assessment/${step}`}>
                          <Button className="w-full">Start Assessment</Button>
                        </Link>
                      )}
                      {status === "completed" && (
                        <div className="text-sm text-gray-600">Completed on {userProgress.lastAssessmentDate}</div>
                      )}
                      {status === "failed" && (
                        <Alert variant="destructive">
                          <AlertDescription>Assessment failed. No retake allowed for Step 1.</AlertDescription>
                        </Alert>
                      )}
                      {status === "locked" && (
                        <div className="text-sm text-gray-500">Complete previous steps to unlock</div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificates</h2>
            <div className="space-y-4">
              {userProgress.certificates.length > 0 ? (
                userProgress.certificates.map((cert, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Level {cert} Certificate</CardTitle>
                        <Badge className={getLevelColor(cert)}>{cert}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Earned on {userProgress.lastAssessmentDate}</span>
                        <Button variant="outline" size="sm">
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No certificates earned yet</p>
                      <p className="text-sm">Complete assessments to earn certificates</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Assessment History */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Recent Activity</h2>
            <div className="space-y-4">
              {assessmentHistory.length > 0 ? (
                assessmentHistory.map((assessment) => (
                  <Card key={assessment.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Step {assessment.step} Assessment</p>
                          <p className="text-sm text-gray-600">
                            Score: {assessment.score}% - Level {assessment.level}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(assessment.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={assessment.status === "passed" ? "default" : "destructive"}>
                          {assessment.status === "passed" ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No assessment history</p>
                      <p className="text-sm">Your completed assessments will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
