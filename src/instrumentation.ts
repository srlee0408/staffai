/**
 * Instrumentation - Next.js 애플리케이션 계측 설정
 * 
 * 주요 역할:
 * 1. Next.js 런타임별 모니터링 초기화 (Sentry 제거됨)
 * 2. 서버 및 엣지 런타임에 따른 조건부 설정 로드
 * 3. 향후 다른 모니터링 시스템 통합을 위한 진입점
 * 
 * 핵심 특징:
 * - Next.js 런타임 환경 감지 및 적절한 설정 로드
 * - 서버 사이드(nodejs)와 엣지(edge) 런타임 분리 지원
 * - 동적 import로 필요한 시점에 설정 파일 로드
 * - 프로덕션 배포 시 자동으로 실행되는 계측 등록
 * 
 * 주의사항:
 * - 현재 Sentry가 제거되어 빈 함수로 유지
 * - 향후 다른 모니터링 도구 추가 시 이 파일에서 설정
 */
export async function register() {
  // Sentry 제거됨 - 향후 다른 모니터링 시스템 추가 시 여기에 구현
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 서버 런타임용 모니터링 설정
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // 엣지 런타임용 모니터링 설정
  }
}