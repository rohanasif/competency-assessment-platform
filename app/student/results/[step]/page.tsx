"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Award, CheckCircle, XCircle, Download, Home, ArrowRight, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

interface AssessmentResult {
  step: number
  score: number
  level: string
  status: "passed" | "failed"
  canProceed: boolean
  certificateEarned: boolean
  nextStep?: number
  completedAt: string
}

function ResultsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const step = Number.parseInt(params.step as string)
  const score = Number.parseInt(searchParams.get("score") || "0")

  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    calculateResult()
  }, [step, score])

  const calculateResult = () => {
    let level = ""
    let status: "passed" | "failed" = "failed"
    let canProceed = false
    let certificateEarned = false
    let nextStep: number | undefined

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
        nextStep = 2
      }
    } else if (step === 2) {
      if (score < 25) {
        status = "passed" // Remain at A2
        level = "A2"
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
        nextStep = 3
      }
    } else if (step === 3) {
      if (score < 25) {
        status = "passed" // Remain at B2
        level = "B2"
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

    setResult({
      step,
      score,
      level,
      status,
      canProceed,
      certificateEarned,
      nextStep,
      completedAt: new Date().toISOString(),
    })
    setIsLoading(false)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
      case "A2":
        return "bg-green-100 text-green-800 border-green-200"
      case "B1":
      case "B2":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "C1":
      case "C2":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600"
    if (score >= 50) return "text-blue-600"
    if (score >= 25) return "text-orange-600"
    return "text-red-600"
  }

  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/download/${result?.level}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${result?.level}_Certificate.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading certificate:", error)
    }
  }

  if (isLoading || !result) {
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
            <Link href="/student/dashboard">
              <Button variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {result.status === "passed" ? (
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment {result.status === "passed" ? "Completed" : "Failed"}
          </h1>
          <p className="text-gray-600">Step {result.step} - Digital Competency Assessment Results</p>
        </div>

        {/* Score Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>{result.score}%</div>
              <Progress value={result.score} className="h-4 mb-4" />
              <Badge className={`text-lg px-4 py-2 ${getLevelColor(result.level)}`}>Level {result.level}</Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">44</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Math.round((result.score / 100) * 44)}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.step === 1 ? "A1 & A2" : result.step === 2 ? "B1 & B2" : "C1 & C2"}
                </div>
                <div className="text-sm text-gray-600">Levels Tested</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Achievement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.status === "failed" ? (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Assessment Failed</strong>
                    <br />
                    Score below 25% threshold. No retake allowed for Step 1.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {result.certificateEarned && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Certificate Earned!</strong>
                        <br />
                        You have earned the Level {result.level} certificate.
                      </AlertDescription>
                    </Alert>
                  )}

                  {result.canProceed && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Excellent Performance!</strong>
                        <br />
                        You can proceed to Step {result.nextStep}.
                      </AlertDescription>
                    </Alert>
                  )}

                  {!result.canProceed && result.status === "passed" && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Assessment Completed</strong>
                        <br />
                        You have achieved Level {result.level} certification.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.certificateEarned && (
                  <Button onClick={handleDownloadCertificate} className="w-full bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                )}

                {result.canProceed && (
                  <Link href={`/student/assessment/${result.nextStep}`}>
                    <Button className="w-full">
                      Continue to Step {result.nextStep}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}

                <Link href="/student/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Dashboard
                  </Button>
                </Link>

                {result.status === "failed" && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Unfortunately, retakes are not allowed for failed Step 1 assessments. Please contact support if
                      you believe there was an error.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Detailed analysis of your assessment performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className={`text-sm font-bold ${getScoreColor(result.score)}`}>{result.score}%</span>
                  </div>
                  <Progress value={result.score} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Competency Coverage</span>
                    <span className="text-sm font-bold text-blue-600">22/22</span>
                  </div>
                  <Progress value={100} />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Score Interpretation:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {step === 1 && (
                    <>
                      <p>• {"<"}25%: Failed - No certification, no retake allowed</p>
                      <p>• 25-49.99%: A1 Level certification</p>
                      <p>• 50-74.99%: A2 Level certification</p>
                      <p>• ≥75%: A2 Level certification + Proceed to Step 2</p>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <p>• {"<"}25%: Remain at A2 Level</p>
                      <p>• 25-49.99%: B1 Level certification</p>
                      <p>• 50-74.99%: B2 Level certification</p>
                      <p>• ≥75%: B2 Level certification + Proceed to Step 3</p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <p>• {"<"}25%: Remain at B2 Level</p>
                      <p>• 25-49.99%: C1 Level certification</p>
                      <p>• ≥50%: C2 Level certification (Highest Level)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
