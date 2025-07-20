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
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      focusColor: "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200",
      tabActiveColor: "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700",
    },
    doctor: {
      icon: Stethoscope,
      title: "Doctor Portal",
      description: "Manage patients and medical records",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      focusColor: "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
      tabActiveColor: "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
    },
    admin: {
      icon: Shield,
      title: "Admin Portal",
      description: "System administration and management",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      focusColor: "focus:border-purple-500 focus:ring-2 focus:ring-purple-200",
      tabActiveColor: "data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700",
    },
  }

  const currentConfig = roleConfig[activeRole as keyof typeof roleConfig];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl ${currentConfig.bgColor} ${currentConfig.borderColor} border-2`}>
              <currentConfig.icon className={`w-8 h-8 ${currentConfig.color}`} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Healthcare Login
          </CardTitle>
          <CardDescription className="text-gray-600">
            Secure access to your healthcare portal
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-100 rounded-lg h-12">
              {Object.entries(roleConfig).map(([role, config]) => (
                <TabsTrigger 
                  key={role}
                  value={role} 
                  className={`text-sm font-medium rounded-md py-2 transition-all ${config.tabActiveColor}`}
                >
                  <config.icon className="w-4 h-4 mr-2" />
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(roleConfig).map(([role, config]) => (
              <TabsContent key={role} value={role} className="space-y-6">
                <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border text-center`}>
                  <h3 className="font-semibold text-gray-900 mb-1">{config.title}</h3>
                  <p className="text-sm text-gray-700">{config.description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${role}`} className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id={`email-${role}`}
                        name="email"
                        type="email"
                        placeholder={`Enter your ${role} email`}
                        required
                        disabled={isLoading}
                        className={`pl-10 h-12 border-gray-300 rounded-lg ${config.focusColor} disabled:opacity-50`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`password-${role}`} className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id={`password-${role}`}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                        className={`pl-10 pr-12 h-12 border-gray-300 rounded-lg ${config.focusColor} disabled:opacity-50`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 hover:bg-gray-100 rounded-md"
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

                  {success && (
                    <Alert className="rounded-lg border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-sm text-green-800">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive" className="rounded-lg border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className={`w-full h-12 text-white font-medium rounded-lg ${config.buttonColor} shadow-md hover:shadow-lg transition-all disabled:opacity-50`}
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

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center space-y-3">
              <button 
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure Connection</span>
                </div>
                <span>•</span>
                <span>24/7 Support Available</span>
              </div>
              
              <p className="text-xs text-gray-400">
                Need help?{" "}
                <a 
                  href="mailto:support@medicare.com" 
                  className="text-blue-600 hover:underline"
                >
                  support@medicare.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}