import { HeroSection } from "./(home)/_components/HeroSection"
import { FeaturesSection } from "./(home)/_components/FeaturesSection"
import { HowItWorksSection } from "./(home)/_components/HowItWorksSection"
import { GallerySection } from "./(home)/_components/GallerySection"
import { CTASection } from "./(home)/_components/CTASection"
import { Footer } from "./(home)/_components/Footer"
import homeTexts from "@/locales/en/home.json"

// ISR (Incremental Static Regeneration) 설정
// 60초마다 백그라운드에서 페이지를 재생성하여 데이터를 업데이트
export const revalidate = 60

/**
 * 홈페이지 - 모든 사용자 접근 가능 (공개 페이지)
 * 
 * 주요 역할:
 * 1. 서비스 소개 및 주요 기능 안내
 * 2. 신규 사용자 유치 및 온보딩
 * 3. 갤러리 및 CTA 섹션으로 회원가입 유도
 * 
 * 핵심 특징:
 * - 인증 없이 모든 사용자 접근 가능
 * - 서버 사이드 렌더링으로 SEO 최적화
 * - ISR로 성능과 최신 데이터 균형
 * - 반응형 디자인으로 모든 디바이스 지원
 * 
 * 주의사항:
 * - 공개 페이지이므로 민감한 정보 노출 금지
 * - CTA 버튼을 통해 회원가입/로그인 유도
 * - 서버 컴포넌트로 SEO 및 성능 최적화
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection texts={homeTexts.hero} />
      <FeaturesSection texts={homeTexts.features} />
      <HowItWorksSection />
      <GallerySection texts={homeTexts.gallery} />
      <CTASection texts={homeTexts.cta} />
      <Footer texts={homeTexts.footer} />
    </div>
  )
}