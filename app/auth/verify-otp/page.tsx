"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Loader2 } from "lucide-react"

function VerifyOTPContent() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed")
      }

      setSuccess("Email verified successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      setSuccess("OTP sent successfully!")
      setCountdown(60) // 60 seconds countdown
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Invalid verification link</p>
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Go back to registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span>Test_School</span>
          </Link>
          <p className="text-gray-600 mt-2">Verify your email address</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">{"Didn't receive the code?"}</p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending || countdown > 0}
                className="text-blue-600 hover:text-blue-700"
              >
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/auth/register" className="text-sm text-blue-600 hover:underline">
                Back to registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  )
}
