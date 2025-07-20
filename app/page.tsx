'use client'
import React, { useState, useEffect } from 'react';
import LoginForm from "@/components/login-form"

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-blue-300/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs with animation */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/25 to-cyan-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-indigo-400/20 to-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-300/15 to-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Geometric animated elements */}
        <div className="absolute top-20 right-20 w-40 h-40 border border-blue-200/40 rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 border border-indigo-200/40 rounded-full animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-blue-300/30 rotate-45 animate-pulse"></div>
        
        <FloatingParticles />
      </div>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-white/10 backdrop-blur-[1px]"></div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Redesigned header section */}
          <div className="text-center mb-10">
            {/* Enhanced logo with 3D glassmorphism effect */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative group cursor-pointer">
                {/* Multiple glow layers for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-700 scale-105"></div>
                
                {/* Main logo container with enhanced glassmorphism */}
                <div className="relative bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-2xl border border-white/30 p-8 rounded-3xl shadow-2xl group-hover:shadow-3xl transform group-hover:scale-105 transition-all duration-700">
                  {/* 3D medical icon with enhanced styling */}
                  <div className="relative">
                    <svg 
                      className="w-14 h-14 text-blue-600 drop-shadow-2xl transform group-hover:rotate-12 transition-transform duration-700" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
                      />
                    </svg>
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-blue-400/15 rounded-2xl blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced title with modern typography */}
            <div className="space-y-5">
              <div className="relative">
                <h1 className="text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight tracking-tight">
                  MediCare
                </h1>
                <div className="text-2xl font-light bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">
                  Portal
                </div>
                {/* Subtle glow behind text */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-3xl -z-10"></div>
              </div>
              
              {/* Modern divider with animation */}
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 animate-pulse"></div>
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
                  <p className="text-sm text-blue-700 font-bold tracking-widest uppercase">
                    Healthcare Excellence
                  </p>
                </div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent via-blue-500 to-transparent opacity-60 animate-pulse"></div>
              </div>
              
              {/* Enhanced subtitle */}
              <p className="text-gray-700 font-light text-xl leading-relaxed max-w-sm mx-auto">
                Your secure gateway to comprehensive healthcare management
              </p>
            </div>
          </div>

          {/* Enhanced login form container */}
          <div className="relative group">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-3xl blur-2xl group-hover:from-blue-400/25 group-hover:to-indigo-400/25 transition-all duration-700"></div>
            
            {/* Glass morphism form with enhanced styling */}
            <div className="relative bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-10 group-hover:shadow-3xl group-hover:bg-white/80 transition-all duration-700">
              <LoginForm />
            </div>
          </div>

          {/* Enhanced footer with live elements */}
          <div className="text-center mt-10 space-y-6">
            {/* Live status indicators with better styling */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-3 px-4 py-2 bg-green-50/80 backdrop-blur-sm rounded-2xl border border-green-200/60 shadow-md">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <span className="text-green-700 font-semibold">System Online</span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-md text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-medium">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            {/* Enhanced trust indicators */}
            <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-gray-800">HIPAA Compliant</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-gray-800">SSL Secured</span>
              </div>
            </div>

            {/* Enhanced help text */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need assistance?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline">
                  24/7 Support Available
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}