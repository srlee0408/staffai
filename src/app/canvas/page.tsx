'use client'

import React from 'react'
import { CanvasProviders } from './_context/CanvasProviders'
import { CanvasLayout } from './_components'
import { AuthGuard } from '@/shared/components/auth/AuthGuard'
import { EffectsDataProvider } from './_hooks/useEffectsData'

/**
 * Canvas 페이지 엔트리 포인트
 * 
 * 주요 역할:
 * 1. 사용자 인증 상태 확인 및 보호
 * 2. Canvas 관련 Context 제공
 * 3. 효과 데이터 제공
 * 
 * 핵심 특징:
 * - AuthGuard로 로그인한 사용자만 접근 가능
 * - 리팩토링된 Context 구조로 성능 최적화
 * - 기능별로 분리된 Context로 불필요한 리렌더링 방지
 * 
 * 주의사항:
 * - 미들웨어에서 1차 보호, 클라이언트에서 2차 보호
 * - 로딩 상태 동안 적절한 UI 표시 필요
 */
export default function CanvasPage(): React.ReactElement {
  return (
    <AuthGuard>
      <EffectsDataProvider>
        <CanvasProviders>
          <CanvasLayout />
        </CanvasProviders>
      </EffectsDataProvider>
    </AuthGuard>
  )
}