import type { Metadata } from 'next'
import { LoginForm } from './_components/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your STAFF AI account to create AI avatars and shopping experiences',
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <i className="ri-robot-line text-white text-lg"></i>
        </div>
        <span className="font-sans text-xl font-bold text-white tracking-tight">STAFF AI</span>
      </Link>
      
      <div className="relative mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Sign in to continue creating AI avatars and shopping experiences
          </p>
        </div>
        
        <div className="relative rounded-2xl bg-surface/50 backdrop-blur-sm border border-border px-8 py-10 shadow-xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
          <div className="relative">
            <LoginForm />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-text-secondary">Don&apos;t have an account? </span>
              <Link 
                href="/signup" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}