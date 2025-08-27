/**
 * ViralMarketingSection - 100% AI-Generated Viral Marketing Videos 섹션
 * 
 * 주요 역할:
 * 1. AI 생성 바이럴 마케팅 비디오의 3가지 주요 유형 소개
 * 2. Brand Promotion, Product Marketing, Try-On Video 예시 제공
 * 3. 각 비디오 타입별 실제 이미지와 설명 표시
 * 
 * 핵심 특징:
 * - mainpage.html의 "100% AI-Generated Viral Marketing Videos" 섹션 구현
 * - 3개의 카드 레이아웃으로 각 비디오 타입 소개
 * - 실제 AI 생성 비디오 이미지 사용
 * - 재생 버튼과 음소거 버튼 UI 포함
 * 
 * 주의사항:
 * - mainpage.html의 이미지 URL 정확히 사용
 * - 각 카드의 높이와 스타일 일관성 유지
 * - 반응형 디자인으로 모든 디바이스 지원
 */

import Image from "next/image";

export function ViralMarketingSection() {
  return (
    <section id="viral-marketing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">100% AI-Generated Viral Marketing Videos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Promotion */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-4">Brand Promotion</h3>
            <p className="text-gray-400 mb-6">Let the avatar showcase your app to create a video</p>
            <div className="relative rounded-xl overflow-hidden">
              <Image 
                src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/0d472e0b03082f80c54d8fe55cac1680.png" 
                alt="App Promotion" 
                className="w-full h-[500px] object-cover"
                width={400}
                height={500}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                  <i className="ri-play-fill text-white text-xl"></i>
                </div>
                <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                  <i className="ri-volume-mute-fill text-white text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Product Marketing */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-4">Product Marketing</h3>
            <p className="text-gray-400 mb-6">Let the avatar hold your product to create a video</p>
            <div className="relative rounded-xl overflow-hidden">
              <Image 
                src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/2033e4e0f1b05c0b15437291134ba565.png" 
                alt="Product Marketing" 
                className="w-full h-[500px] object-cover"
                width={400}
                height={500}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                  <i className="ri-play-fill text-white text-xl"></i>
                </div>
                <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                  <i className="ri-volume-mute-fill text-white text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Try-On Video */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-4">Try-On Video</h3>
            <p className="text-gray-400 mb-6">Let the avatar wear your clothes to create a video</p>
            <div className="relative rounded-xl overflow-hidden">
              <Image 
                src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/ffc2821c43a0cd95dc2045d86549c8bb.png" 
                alt="Try-On Video" 
                className="w-full h-[500px] object-cover"
                width={400}
                height={500}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                  <i className="ri-play-fill text-white text-xl"></i>
                </div>
                <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                  <i className="ri-volume-mute-fill text-white text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
