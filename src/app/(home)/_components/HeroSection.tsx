/**
 * HeroSection - 랜딩 페이지 메인 히어로 섹션 컴포넌트
 * 
 * 주요 역할:
 * 1. VogueDrop 플랫폼의 핵심 가치 제안 전달
 * 2. 사용자 로그인 상태에 따른 CTA 버튼 변경
 * 3. 시각적 임팩트를 위한 배경 효과 및 제품 이미지
 * 4. 다국어 지원을 위한 텍스트 props 인터페이스
 * 
 * 핵심 특징:
 * - 반응형 레이아웃으로 모든 디바이스에서 최적화
 * - 로그인 사용자에게는 Canvas로, 비로그인 사용자에게는 회원가입으로 안내
 * - 배경 애니메이션 효과로 시각적 몰입감 증대
 * - 제품 스크린샷으로 실제 사용 예시 제공
 * 
 * 주의사항:
 * - 사용자 인증 상태 확인으로 적절한 CTA 제공
 * - 이미지 최적화로 페이지 로딩 속도 관리
 * - 텍스트 콘텐츠는 props로 주입하여 유연성 확보
 */
"use client"

import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HomeHeader } from "./HomeHeader";
import { BackgroundEffects } from "./BackgroundEffects";
import { useAuth } from "@/features/user-auth/_context/AuthContext";

interface HeroSectionProps {
  texts: {
    badge: string
    title: {
      line1: string
      line2: string
    }
    description: string
    cta: {
      primary: string
      secondary: string
    }
  }
}

export function HeroSection({ texts }: HeroSectionProps) {
  const { user } = useAuth();
  
  return (
    <>
      <HomeHeader texts={{ login: "Login", getStarted: "Get Started" }} />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <BackgroundEffects />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight">
              {texts.title.line1}
              <span className="block gradient-text">
                {texts.title.line2}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-body-secondary mb-12 max-w-xl">
              {texts.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={user ? "/canvas" : "/login"}>
                <Button size="lg" className="btn-primary group w-full sm:w-auto shadow-lg shadow-primary/20 px-8 py-4 text-lg font-semibold">
                  {user ? "Go to Canvas" : texts.cta.primary}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <Image 
                src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/48ff4126c2f770b87a9e1803b78fef5c.png" 
                alt="AI Avatar Demo" 
                className="w-full rounded-lg object-cover"
                width={600}
                height={400}
                priority
              />
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm">Live Shopping Session</span>
                </div>
                <div className="text-white text-sm">1,247 viewers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}