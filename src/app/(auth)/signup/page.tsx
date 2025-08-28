import type { Metadata } from 'next'
import { SignupForm } from './_components/SignupForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your STAFF AI account to start building AI avatars and shopping experiences',
}

export default function SignupPage() {
  return (
    <div className="relative flex-center min-h-screen px-4">
      <Link href="/" className="absolute top-8 left-8 flex-center space-x-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-primary rounded-lg flex-center">
          <i className="ri-robot-line text-white text-lg"></i>
        </div>
        <span className="font-sans text-xl font-bold text-white tracking-tight">STAFF AI</span>
      </Link>
      
      <div className="relative mx-auto w-full max-w-md space-section">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-base text-body-secondary">
            Join STAFF AI to start creating AI avatars and shopping experiences
          </p>
        </div>
        
        <div className="relative rounded-2xl bg-surface/50 backdrop-blur-sm border border-border px-8 py-10 shadow-xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
          <div className="relative">
            <SignupForm />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-body-secondary">Already have an account? </span>
              <Link 
                href="/login" 
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}