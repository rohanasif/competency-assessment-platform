import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, Shield, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Test_School</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Digital Competency
            <span className="text-blue-600 block">Assessment Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Test and certify your digital skills through our comprehensive 3-step assessment process. Progress from A1
            to C2 levels with secure, timed evaluations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Assessment
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Assessment Levels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Assessment Levels</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Step 1
                  </Badge>
                  A1 & A2 Levels
                </CardTitle>
                <CardDescription>Basic digital literacy and fundamental skills</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Score {"<"}25%: Fail (No retake)</li>
                  <li>• 25-49.99%: A1 Certified</li>
                  <li>• 50-74.99%: A2 Certified</li>
                  <li>• ≥75%: A2 + Proceed to Step 2</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Step 2
                  </Badge>
                  B1 & B2 Levels
                </CardTitle>
                <CardDescription>Intermediate digital competencies</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Score {"<"}25%: Remain at A2</li>
                  <li>• 25-49.99%: B1 Certified</li>
                  <li>• 50-74.99%: B2 Certified</li>
                  <li>• ≥75%: B2 + Proceed to Step 3</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Step 3
                  </Badge>
                  C1 & C2 Levels
                </CardTitle>
                <CardDescription>Advanced digital expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Score {"<"}25%: Remain at B2</li>
                  <li>• 25-49.99%: C1 Certified</li>
                  <li>• ≥50%: C2 Certified</li>
                  <li>• Maximum achievement level</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Timed Assessments</h3>
              <p className="text-gray-600">
                Structured timing with auto-submit functionality to ensure fair evaluation
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Environment</h3>
              <p className="text-gray-600">Safe Exam Browser integration with restricted navigation and monitoring</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Certificates</h3>
              <p className="text-gray-600">Automated certificate generation with PDF download and email delivery</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role Management</h3>
              <p className="text-gray-600">Admin, Student, and Supervisor roles with appropriate permissions</p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Comprehensive reporting and performance analytics for administrators</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Question Pool</h3>
              <p className="text-gray-600">132 questions across 22 competencies and 6 proficiency levels</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Test Your Digital Skills?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have certified their digital competencies
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Start Your Assessment Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-lg font-bold">Test_School</span>
              </div>
              <p className="text-gray-400">Professional digital competency assessment platform</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/assessments" className="hover:text-white">
                    Assessments
                  </Link>
                </li>
                <li>
                  <Link href="/certificates" className="hover:text-white">
                    Certificates
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Test_School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
