'use client'

import React from 'react'
import { useAuth } from '@/features/user-auth/_context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard - 전역 인증 보호 컴포넌트
 * 
 * 주요 역할:
 * 1. 사용자 인증 상태 확인
 * 2. 미인증 시 로그인 페이지로 리다이렉트
 * 3. 로딩 상태 표시
 * 
 * 핵심 특징:
 * - 클라이언트 사이드에서 2차 인증 체크
 * - 부드러운 로딩 UI 제공
 * - 자동 리다이렉트 처리
 * 
 * 주의사항:
 * - 미들웨어에서 1차 보호가 이미 되어있음
 * - 로딩 중에는 빈 화면이 아닌 로딩 UI 표시
 * - 인증 상태 변경 시 즉시 반응
 */
export function AuthGuard({ children }: AuthGuardProps): React.ReactElement {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 로딩이 완료되고 사용자가 없으면 로그인 페이지로 리다이렉트
    if (!loading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [user, loading, router])

  // 로딩 중일 때 로딩 UI 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // 사용자가 없으면 빈 화면 (리다이렉트 진행 중)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // 인증된 사용자만 자식 컴포넌트 렌더링
  return <>{children}</>
}
