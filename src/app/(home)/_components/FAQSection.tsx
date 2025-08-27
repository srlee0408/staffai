/**
 * FAQSection - Frequently Asked Questions 섹션
 * 
 * 주요 역할:
 * 1. AISTAFF 서비스에 대한 자주 묻는 질문과 답변 제공
 * 2. 아코디언 형태의 인터랙티브 UI로 사용자 경험 향상
 * 3. 서비스 이해도 증진 및 사용자 우려사항 해소
 * 
 * 핵심 특징:
 * - mainpage.html의 FAQ 섹션 완전 구현
 * - 클릭 시 펼쳐지는 아코디언 인터페이스
 * - 5개의 핵심 질문과 상세한 답변 제공
 * - Remix Icon을 사용한 시각적 피드백
 * 
 * 주의사항:
 * - 클라이언트 컴포넌트로 구현 (상호작용 필요)
 * - 아코디언 상태 관리 및 애니메이션 처리
 * - 접근성 고려한 키보드 네비게이션 지원
 */

"use client"

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I create my first AI avatar?",
    answer: "Creating your first AI avatar is simple. Choose from our template gallery or upload reference images, select voice characteristics, and customize personality traits. Our AI will generate your avatar in minutes, ready for product presentations."
  },
  {
    question: "Can I update products without recreating videos?",
    answer: "Yes! Our real-time embedding technology allows you to update product information, prices, and availability instantly across all platforms without regenerating videos. Changes appear immediately on your website and in-store displays."
  },
  {
    question: "What languages does AISTAFF support?",
    answer: "AISTAFF supports over 50 languages including English, Spanish, French, German, Japanese, Korean, Chinese, and many more. Each avatar can speak multiple languages with native-like pronunciation and regional accents."
  },
  {
    question: "Do I own the rights to my AI avatar and content?",
    answer: "Absolutely. You retain full commercial rights to your custom AI avatars and all generated content. We provide clear licensing terms and ensure your brand assets remain your intellectual property."
  },
  {
    question: "How difficult is it to embed AISTAFF into my website?",
    answer: "Integration is extremely simple. Just copy and paste a single line of code into your website. We provide plugins for popular platforms like Shopify, WordPress, and WooCommerce. No technical expertise required."
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number): void => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400">Everything you need to know about AISTAFF</p>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg">
              <button 
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-content-${index}`}
              >
                <span className="font-semibold text-white">{item.question}</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${openItems.includes(index) ? 'ri-subtract-line' : 'ri-add-line'} text-gray-400`}></i>
                </div>
              </button>
              {openItems.includes(index) && (
                <div 
                  id={`faq-content-${index}`}
                  className="px-6 pb-4 text-gray-400"
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
