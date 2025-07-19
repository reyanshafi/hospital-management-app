import LoginForm from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 to-indigo-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header section with enhanced styling */}
          <div className="text-center mb-12">
            {/* Logo container with enhanced effects */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-30 scale-110"></div>
                
                {/* Main logo container */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-xl">
                  {/* Enhanced medical icon */}
                  <svg 
                    className="w-10 h-10 text-white drop-shadow-lg" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced title and subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                MediCare Portal
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400"></div>
                <p className="text-gray-600 font-medium tracking-wide">
                  Hospital Management System
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400"></div>
              </div>
              
              {/* Welcome message */}
              <p className="text-sm text-gray-500 mt-4 font-light">
                Secure access to your healthcare portal
              </p>
            </div>
          </div>

          {/* Login form container with enhanced styling */}
          <div className="relative">
            {/* Form background with subtle shadow */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 p-8">
              <LoginForm />
            </div>
          </div>

          {/* Footer elements */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </span>
              <span>•</span>
              <span>24/7 Support Available</span>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>HIPAA Compliant</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Secured</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
