/**
 * AvatarSelectionModal - 아바타 선택 모달 컴포넌트
 * 
 * 주요 역할:
 * 1. 사용 가능한 아바타 목록 표시
 * 2. 아바타 미리보기 이미지
 * 3. 아바타 선택 및 적용
 * 4. 카테고리별 아바타 필터링
 * 
 * 핵심 특징:
 * - 그리드 레이아웃으로 아바타 썸네일 표시
 * - 성별, 연령대별 카테고리 필터
 * - 현재 선택된 아바타 하이라이트
 * - 아바타 호버 시 확대 미리보기
 * 
 * 주의사항:
 * - 아바타 이미지 로딩 최적화
 * - 고해상도 미리보기 이미지 관리
 * - 모달 스크롤 성능 최적화
 */
'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'
import Image from 'next/image'

interface Avatar {
  id: string
  name: string
  thumbnailUrl: string
  category: 'business' | 'casual' | 'professional' | 'creative'
  gender: 'male' | 'female'
  ageGroup: 'young' | 'middle' | 'senior'
}

interface AvatarSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedAvatar: string
  onAvatarSelect: (avatarId: string) => void
}

// 아바타 데이터 (실제로는 API에서 가져와야 함)
const AVATARS: Avatar[] = [
  {
    id: 'avatar-1',
    name: 'Professional Woman',
    thumbnailUrl: 'https://readdy.ai/api/search-image?query=professional%20business%20woman%20avatar%20portrait&width=200&height=200&seq=1',
    category: 'business',
    gender: 'female',
    ageGroup: 'middle'
  },
  {
    id: 'avatar-2',
    name: 'Business Man',
    thumbnailUrl: 'https://readdy.ai/api/search-image?query=professional%20business%20man%20avatar%20portrait&width=200&height=200&seq=2',
    category: 'business',
    gender: 'male',
    ageGroup: 'middle'
  },
  {
    id: 'avatar-3',
    name: 'Casual Woman',
    thumbnailUrl: 'https://readdy.ai/api/search-image?query=casual%20friendly%20woman%20avatar%20portrait&width=200&height=200&seq=3',
    category: 'casual',
    gender: 'female',
    ageGroup: 'young'
  },
  {
    id: 'avatar-4',
    name: 'Creative Man',
    thumbnailUrl: 'https://readdy.ai/api/search-image?query=creative%20designer%20man%20avatar%20portrait&width=200&height=200&seq=4',
    category: 'creative',
    gender: 'male',
    ageGroup: 'young'
  },
  {
    id: 'avatar-5',
    name: 'Senior Professional',
    thumbnailUrl: 'https://readdy.ai/api/search-image?query=senior%20professional%20woman%20avatar%20portrait&width=200&height=200&seq=5',
    category: 'professional',
    gender: 'female',
    ageGroup: 'senior'
  },
  {
    id: 'avatar-6',
    name: 'Young Professional',
    thumbnailUrl: 'https://readdy.ai/api/search-image?query=young%20professional%20man%20avatar%20portrait&width=200&height=200&seq=6',
    category: 'professional',
    gender: 'male',
    ageGroup: 'young'
  }
]

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'business', name: 'Business' },
  { id: 'casual', name: 'Casual' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' }
]

export function AvatarSelectionModal({
  isOpen,
  onClose,
  selectedAvatar,
  onAvatarSelect
}: AvatarSelectionModalProps): React.JSX.Element | null {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 카테고리별 필터링 - 항상 호출되어야 함
  const filteredAvatars = selectedCategory === 'all' 
    ? AVATARS 
    : AVATARS.filter(avatar => avatar.category === selectedCategory)

  // 모달이 열려있지 않으면 null 반환 (모든 훅 호출 후)
  if (!isOpen) return null

  // 아바타 선택 핸들러
  const handleAvatarSelect = (avatarId: string): void => {
    onAvatarSelect(avatarId)
    onClose()
  }

  // 모달 외부 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Select Avatar</h2>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-secondary text-muted-foreground hover:bg-surface-tertiary hover:text-foreground'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid grid-cols-3 gap-4">
            {filteredAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2 ${
                  selectedAvatar === avatar.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleAvatarSelect(avatar.id)}
              >
                {/* Avatar Image */}
                <Image
                  src={avatar.thumbnailUrl}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 700px) 33vw, 233px"
                />

                {/* Selected Indicator */}
                {selectedAvatar === avatar.id && (
                  <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {/* Avatar Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-white font-medium text-sm">{avatar.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/80 text-xs capitalize">{avatar.category}</span>
                    <span className="text-white/60 text-xs">•</span>
                    <span className="text-white/80 text-xs capitalize">{avatar.gender}</span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAvatars.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-2xl text-muted-foreground"></i>
              </div>
              <p className="text-muted-foreground">No avatars found in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
