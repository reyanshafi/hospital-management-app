"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, User, Stethoscope, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { loginUser } from "@/app/actions/auth"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeRole, setActiveRole] = useState("patient")
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("role", activeRole);
      
      console.log('Attempting login with:', {
        email: formData.get('email'),
        role: activeRole
      });

      const result = await loginUser(formData);
      
      console.log('Login result:', result);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess("Login successful! Redirecting...");
        // Store session in localStorage
        window.localStorage.setItem("session", JSON.stringify(result));
        setTimeout(() => {
          const role = result.role || result.user?.role;
          switch (role) {
            case "admin":
              router.push("/admin/dashboard");
              break;
            case "doctor":
              router.push("/doctor/dashboard");
              break;
            case "patient":
              router.push("/patient/dashboard");
              break;
            default:
              router.push("/");
          }
        }, 800);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    patient: {
      icon: User,
      title: "Patient Portal",
      description: "Access your medical records and appointments",
      color: "text-emerald-600",
      bgGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      buttonGradient: "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700",
      focusColor: "focus:border-emerald-500 focus:ring-emerald-500/20",
    },
    doctor: {
      icon: Stethoscope,
      title: "Doctor Portal",
      description: "Manage patients and medical records",
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      buttonGradient: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
      focusColor: "focus:border-blue-500 focus:ring-blue-500/20",
    },
    admin: {
      icon: Shield,
      title: "Admin Portal",
      description: "System administration and management",
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-violet-50",
      borderColor: "border-purple-200",
      buttonGradient: "from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
      focusColor: "focus:border-purple-500 focus:ring-purple-500/20",
    },
  }

  const currentConfig = roleConfig[activeRole as keyof typeof roleConfig];

  return (
    <div className="relative">
      {/* Animated background elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur opacity-25"></div>
      
      <Card className="relative shadow-2xl border-0 backdrop-blur-lg bg-white/95 rounded-2xl overflow-hidden">
        {/* Dynamic header background */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${currentConfig.buttonGradient}`}></div>
        
        <CardHeader className="space-y-2 pb-6 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full bg-gradient-to-br ${currentConfig.bgGradient} ${currentConfig.borderColor} border-2 transition-all duration-300`}>
              <currentConfig.icon className={`w-6 h-6 ${currentConfig.color}`} />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600 font-medium">
            Secure access to your healthcare portal
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            {/* Enhanced Tab List */}
            <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-50 rounded-xl border">
              {Object.entries(roleConfig).map(([role, config]) => (
                <TabsTrigger 
                  key={role}
                  value={role} 
                  className={`text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 py-3 ${
                    activeRole === role ? `${config.color} data-[state=active]:${config.color}` : ''
                  }`}
                >
                  <config.icon className="w-4 h-4 mr-2" />
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(roleConfig).map(([role, config]) => (
              <TabsContent key={role} value={role} className="space-y-6">
                {/* Role Information Card */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} text-center transition-all duration-300`}>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{config.title}</h3>
                  <p className="text-sm text-gray-700">{config.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`email-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id={`email-${role}`}
                        name="email"
                        type="email"
                        placeholder={`Enter your ${role} email address`}
                        required
                        disabled={isLoading}
                        className={`h-12 pl-4 pr-4 text-sm border-2 border-gray-200 rounded-xl ${config.focusColor} transition-all duration-200 group-hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`password-${role}`} className="text-sm font-semibold text-gray-700 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        id={`password-${role}`}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your secure password"
                        required
                        disabled={isLoading}
                        className={`h-12 pl-4 pr-12 text-sm border-2 border-gray-200 rounded-xl ${config.focusColor} transition-all duration-200 group-hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        className="absolute right-1 top-1 h-10 w-10 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Success Alert */}
                  {success && (
                    <Alert className="rounded-xl border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-sm font-medium text-green-700">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className={`w-full h-12 text-sm font-semibold rounded-xl bg-gradient-to-r ${config.buttonGradient} border-0 shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:hover:scale-100 disabled:opacity-60`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </div>
                    ) : success ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Success! Redirecting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <config.icon className="w-4 h-4 mr-2" />
                        Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          {/* Footer Section */}
          <div className="mt-8 space-y-4">
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-gray-500 font-medium">Need assistance?</span>
              </div>
            </div>

            {/* Support Links */}
            <div className="text-center space-y-3">
              <button 
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure Connection</span>
                </div>
                <span>•</span>
                <span>24/7 IT Support Available</span>
              </div>
              
              <div className="text-xs text-gray-400">
                Having trouble? Email us at{" "}
                <a 
                  href="mailto:support@medicare.com" 
                  className="text-blue-600 hover:underline transition-colors"
                >
                  support@medicare.com
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
