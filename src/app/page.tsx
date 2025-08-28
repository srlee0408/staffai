import type { Metadata } from "next"
import { HeroSection } from "./(home)/_components/HeroSection"
import { ViralMarketingSection } from "./(home)/_components/ViralMarketingSection"
import { FeaturesSection } from "./(home)/_components/FeaturesSection"
import { VideoEditingSection } from "./(home)/_components/VideoEditingSection"
import { FAQSection } from "./(home)/_components/FAQSection"
import { CTASection } from "./(home)/_components/CTASection"
import { Footer } from "./(home)/_components/Footer"
import homeTexts from "@/locales/en/home.json"

export const metadata: Metadata = {
  title: "STAFF AI - AI Avatars Host 24/7 Shopping Podcasts In-Store & Online",
  description: "Create custom avatars, showcase products, and generate shopping videos. Embed real-time in stores and websites for seamless customer experiences. 100% AI-Generated Viral Marketing Videos.",
  keywords: "AI avatars, 24/7 shopping, viral marketing videos, brand promotion, product marketing, try-on video, AI script generation, virtual try-on, auto script generation",
  openGraph: {
    title: "STAFF AI - AI Avatars Host 24/7 Shopping Podcasts In-Store & Online",
    description: "Create custom avatars, showcase products, and generate shopping videos. Embed real-time in stores and websites for seamless customer experiences.",
    images: [
      {
        url: "https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/48ff4126c2f770b87a9e1803b78fef5c.png",
        width: 1200,
        height: 630,
        alt: "STAFF AI AI Avatar Demo - Live Shopping Session",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STAFF AI - AI Avatars Host 24/7 Shopping Podcasts",
    description: "Create custom avatars, showcase products, and generate shopping videos. 100% AI-Generated Viral Marketing Videos.",
    images: ["https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/48ff4126c2f770b87a9e1803b78fef5c.png"],
  },
}

// ISR (Incremental Static Regeneration) 설정
// 60초마다 백그라운드에서 페이지를 재생성하여 데이터를 업데이트
export const revalidate = 60

/**
 * STAFF AI 홈페이지 - AI 아바타 쇼핑 경험 플랫폼
 * 
 * 주요 역할:
 * 1. AI 아바타 기반 쇼핑 서비스 소개
 * 2. 바이럴 마케팅 비디오 생성 기능 안내
 * 3. AI 비디오 편집 기술 소개
 * 4. FAQ를 통한 서비스 이해도 증진
 * 
 * 핵심 특징:
 * - AI 아바타가 24/7 쇼핑 팟캐스트 진행
 * - 100% AI 생성 바이럴 마케팅 비디오
 * - 실시간 매장 및 웹사이트 임베딩
 * - 다국어 지원 (20개 이상 언어)
 * 
 * 주의사항:
 * - STAFF AI 브랜딩 일관성 유지
 * - AI 기술의 전문성과 신뢰성 강조
 * - 사용자 친화적 FAQ 제공
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection texts={homeTexts.hero} />
      <ViralMarketingSection />
      <FeaturesSection texts={homeTexts.features} />
      <VideoEditingSection texts={homeTexts.howItWorks} />
      <FAQSection />
      <CTASection texts={homeTexts.cta} />
      <Footer texts={homeTexts.footer} />
    </div>
  )
}