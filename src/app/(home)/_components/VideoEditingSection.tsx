/**
 * VideoEditingSection - Real AI for Video Editing 섹션
 * 
 * 주요 역할:
 * 1. AI 기반 비디오 편집 기술의 6가지 핵심 기능 소개
 * 2. AI Script, Clip Selection, Voiceover, Avatars, Auto-caption, 다국어 지원
 * 3. 각 기능별 상세 설명과 실제 이미지 제공
 * 
 * 핵심 특징:
 * - mainpage.html의 "Real AI for Video Editing" 섹션 완전 구현
 * - 좌우 교대 레이아웃으로 시각적 다양성 제공
 * - 실제 AI 기술 이미지와 국기 이미지 사용
 * - GPT-4x, OpenAI, ElevenLabs 등 기술 파트너 언급
 * 
 * 주의사항:
 * - mainpage.html의 모든 이미지 URL 정확히 사용
 * - 텍스트 내용 원문 그대로 유지
 * - 반응형 레이아웃으로 모바일 최적화
 */

import Image from "next/image";

interface VideoEditingSectionProps {
  texts: {
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
}

export function VideoEditingSection({ texts }: VideoEditingSectionProps) {
  return (
    <section id="video-editing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{texts.title}</h2>
          <p className="text-xl text-gray-400">{texts.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {/* AI Script */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">AI Script</h3>
                <p className="text-gray-400">Using GPT-4x, our tool learns from 5 million videos to write perfect scripts. Advanced language models ensure engaging and natural content creation.</p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex gap-4">
                  <Image 
                    src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/8dcf3e2d974bf0f78c6d101fc4a0666d.png" 
                    alt="AI Script Generation" 
                    className="w-2/3 rounded-xl shadow-lg"
                    width={400}
                    height={300}
                  />
                  <Image 
                    src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/d11d46ceb392acb2d66a850828237fe1.png" 
                    alt="AI Avatar" 
                    className="w-1/3 rounded-xl shadow-lg object-cover"
                    width={200}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI-powered Clip Selection */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">AI-powered Clip Selection</h3>
                <p className="text-gray-400">AI automatically understands, selects, and edits your video clips. Smart algorithms ensure perfect timing and seamless transitions.</p>
              </div>
              <div className="w-full md:w-1/2">
                <Image 
                  src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/171a5d44c88bdc2c8a8e0c5fded31972.png" 
                  alt="AI Clip Selection" 
                  className="w-full rounded-xl shadow-lg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* AI Voiceover */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">AI Voiceover</h3>
                <p className="text-gray-400">OpenAI and ElevenLabs provide lifelike AI voices for professional, engaging video content. Multiple voice options and emotional tones available.</p>
              </div>
              <div className="w-full md:w-1/2">
                <Image 
                  src="https://static.readdy.ai/image/6f7165cfe0b25edc582c9815e9f0cfd2/f22ed5b50ef32b6992a753fbddc376b3.png" 
                  alt="AI Voiceover" 
                  className="w-full rounded-xl shadow-lg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* AI Avatars */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">AI Avatars</h3>
                <p className="text-gray-400">Our AI tool provides diverse avatars designed specifically for marketing. Create engaging presentations with realistic virtual hosts.</p>
              </div>
              <div className="w-full md:w-1/2">
                <Image 
                  src="https://public.readdy.ai/ai/img_res/65714d03-ae48-4402-8b25-7895b7eff7fd.png" 
                  alt="AI Avatars" 
                  className="w-full rounded-xl shadow-lg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* AI Auto-caption */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">AI Auto-caption</h3>
                <p className="text-gray-400">AI auto-generates diverse subtitle styles for viral short videos. Multiple caption styles and automatic language detection.</p>
              </div>
              <div className="w-full md:w-1/2">
                <Image 
                  src="https://public.readdy.ai/ai/img_res/2166563f-e04b-45f2-835c-1f1acc836531.png" 
                  alt="AI Auto-caption" 
                  className="w-full rounded-xl shadow-lg"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* 20+ Language Support */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-white mb-4">20+ Language Support</h3>
                <p className="text-gray-400">Supports 20+ languages and AI voices for comprehensive video solutions. Global reach with localized content creation.</p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <div className="w-12 h-12 overflow-hidden rounded-full mb-2">
                      <Image 
                        src="https://readdy.ai/api/search-image?query=United%20States%20flag%20waving%20in%20the%20wind%2C%20high%20quality%20realistic%20flag%20texture%2C%20detailed%20fabric%20texture%2C%20professional%20photography&width=100&height=100&seq=us_flag&orientation=squarish" 
                        alt="US Flag" 
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="text-white">English</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <div className="w-12 h-12 overflow-hidden rounded-full mb-2">
                      <Image 
                        src="https://readdy.ai/api/search-image?query=Spain%20flag%20waving%20in%20the%20wind%2C%20high%20quality%20realistic%20flag%20texture%2C%20detailed%20fabric%20texture%2C%20professional%20photography&width=100&height=100&seq=spain_flag&orientation=squarish" 
                        alt="Spain Flag" 
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="text-white">Spanish</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <div className="w-12 h-12 overflow-hidden rounded-full mb-2">
                      <Image 
                        src="https://readdy.ai/api/search-image?query=France%20flag%20waving%20in%20the%20wind%2C%20high%20quality%20realistic%20flag%20texture%2C%20detailed%20fabric%20texture%2C%20professional%20photography&width=100&height=100&seq=france_flag&orientation=squarish" 
                        alt="France Flag" 
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="text-white">French</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <div className="w-12 h-12 overflow-hidden rounded-full mb-2">
                      <Image 
                        src="https://readdy.ai/api/search-image?query=Germany%20flag%20waving%20in%20the%20wind%2C%20high%20quality%20realistic%20flag%20texture%2C%20detailed%20fabric%20texture%2C%20professional%20photography&width=100&height=100&seq=germany_flag&orientation=squarish" 
                        alt="Germany Flag" 
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="text-white">German</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <div className="w-12 h-12 overflow-hidden rounded-full mb-2">
                      <Image 
                        src="https://readdy.ai/api/search-image?query=South%20Korea%20flag%20waving%20in%20the%20wind%2C%20high%20quality%20realistic%20flag%20texture%2C%20detailed%20fabric%20texture%2C%20professional%20photography&width=100&height=100&seq=korea_flag&orientation=squarish" 
                        alt="Korea Flag" 
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="text-white">Korean</span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                      <i className="ri-global-line text-xl text-primary"></i>
                    </div>
                    <span className="text-white">15+ More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
