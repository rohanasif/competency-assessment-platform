"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight, BookOpen, Shield } from "lucide-react"

interface Question {
  id: string
  competency: string
  level: string
  question: string
  options: string[]
  correctAnswer: number
}

interface AssessmentState {
  currentQuestionIndex: number
  answers: Record<string, number>
  timeRemaining: number
  isSubmitted: boolean
  questions: Question[]
}

export default function AssessmentPage() {
  const params = useParams()
  const router = useRouter()
  const step = Number.parseInt(params.step as string)

  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 44 * 60, // 44 minutes for 44 questions (1 min per question)
    isSubmitted: false,
    questions: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [isSecureMode, setIsSecureMode] = useState(false)

  // Mock questions data
  const mockQuestions: Question[] = Array.from({ length: 44 }, (_, index) => ({
    id: `q${index + 1}`,
    competency: `Competency ${(index % 22) + 1}`,
    level:
      step === 1
        ? index % 2 === 0
          ? "A1"
          : "A2"
        : step === 2
          ? index % 2 === 0
            ? "B1"
            : "B2"
          : index % 2 === 0
            ? "C1"
            : "C2",
    question: `Sample question ${index + 1} for Step ${step}: Which of the following best describes digital competency at this level?`,
    options: [
      "Basic understanding of digital tools",
      "Intermediate application of digital skills",
      "Advanced digital problem-solving",
      "Expert-level digital innovation",
    ],
    correctAnswer: Math.floor(Math.random() * 4),
  }))

  useEffect(() => {
    // Initialize assessment
    setAssessmentState((prev) => ({
      ...prev,
      questions: mockQuestions,
    }))
    setIsLoading(false)

    // Enable secure mode (mock implementation)
    setIsSecureMode(true)

    // Prevent page refresh/navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [step])

  // Timer countdown
  useEffect(() => {
    if (assessmentState.timeRemaining > 0 && !assessmentState.isSubmitted) {
      const timer = setTimeout(() => {
        setAssessmentState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)

      return () => clearTimeout(timer)
    } else if (assessmentState.timeRemaining === 0 && !assessmentState.isSubmitted) {
      // Auto-submit when time runs out
      handleSubmitAssessment()
    }
  }, [assessmentState.timeRemaining, assessmentState.isSubmitted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAssessmentState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerIndex,
      },
    }))
  }

  const handleNextQuestion = () => {
    if (assessmentState.currentQuestionIndex < assessmentState.questions.length - 1) {
      setAssessmentState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    }
  }

  const handlePreviousQuestion = () => {
    if (assessmentState.currentQuestionIndex > 0) {
      setAssessmentState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
    }
  }

  const handleSubmitAssessment = useCallback(async () => {
    setAssessmentState((prev) => ({ ...prev, isSubmitted: true }))

    // Calculate score
    const correctAnswers = assessmentState.questions.filter(
      (q) => assessmentState.answers[q.id] === q.correctAnswer,
    ).length

    const score = Math.round((correctAnswers / assessmentState.questions.length) * 100)

    try {
      // Submit assessment results
      const response = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          step,
          answers: assessmentState.answers,
          score,
          timeSpent: 44 * 60 - assessmentState.timeRemaining,
        }),
      })

      if (response.ok) {
        router.push(`/student/results/${step}?score=${score}`)
      } else {
        throw new Error("Failed to submit assessment")
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
      // Handle error - maybe show error message and allow retry
    }
  }, [assessmentState, step, router])

  const getAnsweredCount = () => {
    return Object.keys(assessmentState.answers).length
  }

  const currentQuestion = assessmentState.questions[assessmentState.currentQuestionIndex]
  const progress = ((assessmentState.currentQuestionIndex + 1) / assessmentState.questions.length) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (assessmentState.isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Assessment Submitted</h2>
              <p className="text-gray-600 mb-4">
                Your answers have been submitted successfully. Calculating results...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Secure Mode Indicator */}
      {isSecureMode && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm">
          <Shield className="inline h-4 w-4 mr-2" />
          Secure Assessment Mode Active - Navigation restricted
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Test_School</span>
              <Badge variant="secondary">Step {step} Assessment</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={`font-mono ${assessmentState.timeRemaining < 300 ? "text-red-600" : "text-gray-600"}`}>
                  {formatTime(assessmentState.timeRemaining)}
                </span>
              </div>
              <Badge variant="outline">
                {getAnsweredCount()}/{assessmentState.questions.length} answered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {assessmentState.currentQuestionIndex + 1} of {assessmentState.questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Time Warning */}
        {assessmentState.timeRemaining < 300 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Less than 5 minutes remaining! The assessment will auto-submit when time expires.
            </AlertDescription>
          </Alert>
        )}

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Question {assessmentState.currentQuestionIndex + 1}</CardTitle>
                <CardDescription>
                  {currentQuestion?.competency} - Level {currentQuestion?.level}
                </CardDescription>
              </div>
              <Badge
                className={
                  currentQuestion?.level.startsWith("A")
                    ? "bg-green-100 text-green-800"
                    : currentQuestion?.level.startsWith("B")
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                }
              >
                {currentQuestion?.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg text-gray-900 leading-relaxed">{currentQuestion?.question}</p>
            </div>

            <RadioGroup
              value={assessmentState.answers[currentQuestion?.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion?.id, Number.parseInt(value))}
            >
              {currentQuestion?.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={assessmentState.currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {assessmentState.currentQuestionIndex === assessmentState.questions.length - 1 ? (
              <Button
                onClick={() => setShowWarning(true)}
                className="bg-green-600 hover:bg-green-700"
                disabled={getAnsweredCount() === 0}
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={assessmentState.currentQuestionIndex === assessmentState.questions.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Submit Warning Dialog */}
        {showWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  Submit Assessment
                </CardTitle>
                <CardDescription>Are you sure you want to submit your assessment?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>
                      • You have answered {getAnsweredCount()} out of {assessmentState.questions.length} questions
                    </p>
                    <p>• Time remaining: {formatTime(assessmentState.timeRemaining)}</p>
                    <p>• You cannot change your answers after submission</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setShowWarning(false)} className="flex-1">
                      Continue Assessment
                    </Button>
                    <Button onClick={handleSubmitAssessment} className="flex-1 bg-green-600 hover:bg-green-700">
                      Submit Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
