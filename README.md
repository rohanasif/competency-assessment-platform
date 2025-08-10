# Test_School - Digital Competency Assessment Platform

A comprehensive full-stack digital competency assessment platform built with Next.js, TypeScript, and modern web technologies. This platform allows users to test and certify their digital skills through a secure, structured 3-step progressive evaluation system.

## 🚀 Features

### Core Assessment System
- **3-Step Progressive Assessment**: A1/A2 → B1/B2 → C1/C2 levels
- **Intelligent Scoring System**: Automatic level assignment based on performance
- **Timer-Based Assessments**: Configurable time limits with auto-submit functionality
- **Question Pool Management**: 132 questions across 22 competencies and 6 levels
- **Secure Testing Environment**: Browser restrictions and monitoring capabilities

### Authentication & Security
- **JWT-based Authentication**: Access and refresh token implementation
- **OTP Verification System**: Email-based verification for new registrations
- **Role-based Access Control**: Admin, Student, and Supervisor roles
- **Password Security**: bcrypt hashing with secure password policies
- **Session Management**: Secure token storage and refresh mechanisms

### User Management
- **Multi-role System**: Different dashboards for Admin, Student, and Supervisor
- **User Progress Tracking**: Comprehensive progress monitoring and analytics
- **Certificate Generation**: Automated digital certificate creation and delivery
- **Assessment History**: Detailed tracking of all assessment attempts

### Admin Dashboard
- **User Management**: Complete CRUD operations for user accounts
- **Assessment Monitoring**: Real-time assessment tracking and analytics
- **Performance Analytics**: Comprehensive reporting and data visualization
- **System Configuration**: Platform settings and customization options

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing and verification
- **Node.js**: Runtime environment

### Database (Mock Implementation)
- **In-memory Storage**: Mock database for demonstration
- **MongoDB Ready**: Structured for easy MongoDB integration
- **Mongoose Compatible**: Schema design ready for Mongoose ODM

## 📋 Assessment Flow

### Step 1: Basic Level (A1 & A2)
- **< 25%**: Failed - No retake allowed
- **25-49.99%**: A1 Certificate
- **50-74.99%**: A2 Certificate  
- **≥ 75%**: A2 Certificate + Proceed to Step 2

### Step 2: Intermediate Level (B1 & B2)
- **< 25%**: Remain at A2
- **25-49.99%**: B1 Certificate
- **50-74.99%**: B2 Certificate
- **≥ 75%**: B2 Certificate + Proceed to Step 3

### Step 3: Advanced Level (C1 & C2)
- **< 25%**: Remain at B2
- **25-49.99%**: C1 Certificate
- **≥ 50%**: C2 Certificate (Highest Level)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd test-school-competency-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👥 Demo Credentials

### Admin Access
- **Email**: admin@testschool.com
- **Password**: admin123

### Student Access  
- **Email**: student@testschool.com
- **Password**: student123

### Supervisor Access
- **Email**: supervisor@testschool.com  
- **Password**: supervisor123

## 📁 Project Structure

\`\`\`
test-school-competency-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── assessments/          # Assessment endpoints
│   ├── auth/                     # Authentication pages
│   ├── student/                  # Student dashboard and features
│   ├── admin/                    # Admin dashboard and management
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions
├── public/                       # Static assets
└── README.md                     # Project documentation
\`\`\`

## 🔧 Key Features Implementation

### Authentication System
- JWT access tokens (15-minute expiry)
- Refresh tokens (7-day expiry)
- OTP-based email verification
- Password reset functionality
- Role-based route protection

### Assessment Engine
- Dynamic question loading
- Real-time timer management
- Auto-submit on timeout
- Progress tracking
- Score calculation and level assignment

### Security Features
- Secure exam browser integration ready
- CORS protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Accessible UI components
- Modern design system

## 🔒 Security Considerations

- **Password Security**: bcrypt hashing with salt rounds
- **Token Security**: Short-lived access tokens with refresh mechanism
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored securely

## 📊 Database Schema (Ready for MongoDB)

### Users Collection
\`\`\`typescript
interface User {
  _id: ObjectId
  firstName: string
  lastName: string
  email: string
  password: string // hashed
  role: 'admin' | 'student' | 'supervisor'
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Assessments Collection
\`\`\`typescript
interface Assessment {
  _id: ObjectId
  userId: ObjectId
  step: number
  answers: Record<string, number>
  score: number
  level: string
  status: 'passed' | 'failed'
  timeSpent: number
  completedAt: Date
}
\`\`\`

### User Progress Collection
\`\`\`typescript
interface UserProgress {
  _id: ObjectId
  userId: ObjectId
  currentLevel: string
  currentStep: number
  completedSteps: number[]
  failedAtStep1: boolean
  certificates: string[]
  lastAssessmentDate: Date
}
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔄 Future Enhancements

- **Real Database Integration**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer or SendGrid integration
- **File Upload**: Certificate and document management
- **Advanced Analytics**: Detailed performance metrics
- **Mobile App**: React Native companion app
- **API Documentation**: Swagger/OpenAPI integration
- **Testing Suite**: Jest and Cypress test coverage
- **Docker Support**: Containerization for easy deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@testschool.com
- Documentation: [Project Wiki](link-to-wiki)
- Issues: [GitHub Issues](link-to-issues)

---

**Built with ❤️ for EForgeIT Assessment**

This project demonstrates proficiency in:
- Full-stack TypeScript development
- Modern React patterns and hooks
- Next.js App Router and API routes
- Authentication and authorization
- Database design and management
- Responsive UI/UX design
- Security best practices
- Code organization and documentation
