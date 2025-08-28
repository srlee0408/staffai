/**
 * AvatarItemGenerator - Avatar Item 이미지 생성 컴포넌트
 * 
 * 주요 역할:
 * 1. Avatar Item 이미지 생성을 위한 전용 UI 제공
 * 2. 브러시 도구, 해상도 설정, 세그멘테이션 등 이미지 편집 기능
 * 3. 이미지 업로드 및 미리보기 기능
 * 4. 프롬프트 입력 및 생성 제어
 * 
 * 핵심 특징:
 * - Avatar Item 생성에 특화된 이미지 편집 UI
 * - 중앙 이미지 미리보기 영역과 편집 도구들
 * - 우측 생성된 이미지 갤러리
 * - 하단 프롬프트 입력 및 생성 버튼
 * 
 * 주의사항:
 * - 기존 Canvas 컴포넌트와 독립적으로 동작
 * - 상태 관리는 상위 컴포넌트에서 처리
 * - 이미지 편집 도구들의 상호작용 관리 필요
 */
'use client'

import { useState, useRef } from 'react'
import { 
  Plus, 
  ImageIcon,
  Bookmark,
  Trash2
} from 'lucide-react'
import Image from 'next/image'

interface AvatarItemGeneratorProps {
  generatedImages?: string[]
}

export function AvatarItemGenerator({
  generatedImages = []
}: AvatarItemGeneratorProps) {
  const [isSaved, setIsSaved] = useState(false)
  // 메인 영역의 독립적인 이미지 상태
  const [mainImage, setMainImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 메인 영역 파일 업로드 핸들러 (독립적)
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setMainImage(imageUrl) // 독립적인 상태로 관리
      }
      reader.readAsDataURL(file)
    }
  }

  // 메인 이미지 삭제 핸들러
  const handleMainImageDelete = () => {
    setMainImage(null)
    setIsSaved(false) // 삭제 시 즐겨찾기도 해제
  }



  return (
    <div className="flex-1 flex bg-background">
      <div className="flex-1 flex flex-col">
        {/* Main Content Area - Image Preview + Thumbnails */}
        <div className="flex-1 p-4 min-h-0">
          {/* Main Image Preview */}
          <div className="flex-1 flex items-center justify-center mb-4 min-h-0">
            <div className="relative bg-surface rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer overflow-hidden" style={{ height: 'calc(100vh - 300px)', width: mainImage ? 'auto' : 'calc(100vh - 300px)' }}>
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleMainImageUpload}
                ref={fileInputRef}
              />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                {/* Delete Button - only show when image exists */}
                {mainImage && (
                  <button 
                    className="w-10 h-10 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium rounded-full flex items-center justify-center transition-colors"
                    onClick={handleMainImageDelete}
                    title="Delete image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                
                {/* Save Button */}
                <button 
                  className={`w-10 h-10 ${isSaved ? 'bg-primary' : 'bg-primary hover:bg-primary/90'} text-white font-medium rounded-full flex items-center justify-center transition-colors`}
                  onClick={() => setIsSaved(!isSaved)}
                  title={isSaved ? "Remove from favorites" : "Add to favorites"}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {mainImage ? (
                <Image
                  src={mainImage}
                  alt="Main canvas image"
                  className="max-w-full max-h-full object-contain"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: 'auto', height: '100%' }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Click to upload a reference image</p>
                  <p className="text-xs mt-2">Upload an avatar or character image</p>
                </div>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          <div className="flex gap-2 justify-center items-center">
            <button 
              className="w-12 h-12 bg-surface rounded-md flex items-center justify-center border-2 border-primary relative overflow-hidden hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-5 h-5 text-primary" />
            </button>
            
            {generatedImages.slice(0, 4).map((image, index) => (
              <div key={index} className="w-12 h-12 bg-surface rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt={`Generated Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* Right Gallery Panel - Same structure as CanvasHistoryPanel */}
      <div className="w-[420px] flex flex-col space-y-3 pl-2 pr-0 py-2 h-full">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full whitespace-nowrap">
            All
          </button>
          <button className="px-4 py-2 bg-surface text-muted-foreground hover:bg-surface-secondary text-sm font-medium rounded-full whitespace-nowrap">
            model
          </button>
          <button className="px-4 py-2 bg-surface text-muted-foreground hover:bg-surface-secondary text-sm font-medium rounded-full whitespace-nowrap">
            Portrait
          </button>
          <button className="px-4 py-2 bg-surface text-muted-foreground hover:bg-surface-secondary text-sm font-medium rounded-full whitespace-nowrap">
            Product
          </button>
        </div>

        {/* Generated Images Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Add New Button */}
          <div className="aspect-[3/4] bg-primary/5 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30 hover:border-primary transition-colors cursor-pointer">
            <Plus className="w-6 h-6 text-primary" />
          </div>

          {/* Generated Images */}
          {generatedImages.map((image, index) => (
            <div key={index} className="aspect-[3/4] bg-surface rounded-xl overflow-hidden relative group cursor-pointer">
              <Image
                src={image}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 420px) 33vw, 140px"
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
