/**
 * FeaturesSection - STAFF AI 주요 기능 소개 섹션
 * 
 * 주요 역할:
 * 1. AISTAFF의 핵심 기능들을 시각적으로 소개
 * 2. AI Avatar Generation, Virtual Try-On, Auto Script Generation 등 6개 기능
 * 3. mainpage.html의 "Powerful Features" 섹션 완전 구현
 * 4. 각 기능별 실제 이미지와 상세 설명 제공
 * 
 * 핵심 특징:
 * - 3x2 그리드 레이아웃으로 6개 기능 표시
 * - Remix Icon 사용으로 일관된 아이콘 스타일
 * - mainpage.html의 실제 이미지 URL 사용
 * - 각 카드에 호버 효과 및 그림자 적용
 * 
 * 주의사항:
 * - mainpage.html의 이미지 URL 정확히 사용
 * - 텍스트 내용 원문 그대로 유지
 * - 반응형 디자인으로 모든 디바이스 지원
 */
import Image from "next/image"

interface Feature {
  title: string
  description: string
  image: string
  icon: string
}

interface FeaturesSectionProps {
  texts: {
    title: string
    subtitle: string
    tagline?: string
    items: Feature[]
  }
}

export function FeaturesSection({ texts }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {texts.items.map((feature, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <i className={`ri-${feature.icon}-line text-2xl text-primary`}></i>
              </div>
              <div className="mb-6 overflow-hidden rounded-lg">
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-96 object-cover rounded-lg"
                  width={400}
                  height={384}
                />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}