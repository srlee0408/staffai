/**
 * ScriptHistoryPanel - 스크립트 페이지 우측 히스토리 패널 컴포넌트
 * 
 * 주요 역할:
 * 1. 생성된 아바타 영상 히스토리 표시
 * 2. 필터 탭을 통한 영상 분류 (All, Script, Audio)
 * 3. 영상 썸네일 그리드 레이아웃
 * 4. 영상 선택 및 미리보기 기능
 * 
 * 핵심 특징:
 * - CanvasHistoryPanel과 동일한 UI 구조
 * - 3열 그리드 레이아웃으로 영상 썸네일 표시
 * - 호버 시 재생 미리보기 효과
 * - 즐겨찾기 영상 우선 표시
 * 
 * 주의사항:
 * - 영상 로딩 성능 최적화
 * - 무한 스크롤 또는 페이지네이션 고려
 * - 썸네일 이미지 품질 및 로딩 시간
 */
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { GeneratedVideo } from '@/shared/types/canvas'

interface ScriptHistoryPanelProps {
  onVideoSelect: (video: GeneratedVideo) => void
}

export function ScriptHistoryPanel({
  onVideoSelect
}: ScriptHistoryPanelProps): React.JSX.Element {
  const [historyVideos, setHistoryVideos] = useState<GeneratedVideo[]>([])
  
  // 히스토리 데이터 로드
  useEffect(() => {
    // TODO: 실제 API 호출로 교체
    const mockHistoryData: GeneratedVideo[] = [
      {
        id: 'mock-video-1',
        url: '/placeholder-video.mp4',
        thumbnail: 'https://readdy.ai/api/search-image?query=A%20professional%20portrait%20photo%20of%20a%20young%20woman%20with%20natural%20makeup%20and%20casual%20style%2C%20holding%20a%20skincare%20product%2C%20clean%20studio%20background&width=200&height=200&seq=101&orientation=squarish',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
        duration: 10,
        isFavorite: false,
        metadata: {
          type: 'script',
          script: 'Professional skincare product presentation...'
        }
      },
      {
        id: 'mock-video-2',
        url: '/placeholder-video.mp4',
        thumbnail: 'https://readdy.ai/api/search-image?query=A%20professional%20portrait%20photo%20of%20a%20young%20woman%20with%20natural%20makeup%20and%20casual%20style%2C%20holding%20a%20skincare%20product%2C%20clean%20studio%20background&width=200&height=200&seq=101&orientation=squarish',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
        duration: 6,
        isFavorite: true,
        metadata: {
          type: 'audio',
          audioFile: 'presentation.mp3'
        }
      },
      {
        id: 'mock-video-3',
        url: '/placeholder-video.mp4',
        thumbnail: 'https://readdy.ai/api/search-image?query=A%20professional%20portrait%20photo%20of%20a%20young%20woman%20with%20natural%20makeup%20and%20casual%20style%2C%20holding%20a%20skincare%20product%2C%20clean%20studio%20background&width=200&height=200&seq=101&orientation=squarish',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
        duration: 8,
        isFavorite: false,
        metadata: {
          type: 'script',
          script: 'Beauty product demonstration video...'
        }
      }
    ]
    setHistoryVideos(mockHistoryData)
  }, [])
  
  // 상대 시간 계산
  const getRelativeTime = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <div className="w-1/6 flex flex-col pl-2 pr-2 py-2 h-full">
      {/* Videos List - Single Column */}
      <div className="flex flex-col gap-1 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
        {/* History Videos */}
        {historyVideos.map((video) => (
          <div 
            key={video.id} 
            className="aspect-[9/16] bg-surface rounded-lg overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
            onClick={() => onVideoSelect(video)}
          >
            <Image
              src={video.thumbnail || '/placeholder.svg'}
              alt={`Generated video ${video.id}`}
              className="w-full h-full object-cover"
              fill
              sizes="320px"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-medium">
                  {video.duration ? `${video.duration}s` : 'Video'}
                </span>
                {video.isFavorite && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <i className="ri-heart-fill text-xs text-white"></i>
                  </div>
                )}
              </div>
              <p className="text-white text-xs opacity-80 mt-1">
                {getRelativeTime(video.createdAt.toISOString())}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {historyVideos.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-video-line text-2xl text-muted-foreground"></i>
            </div>
            <p className="text-muted-foreground text-sm">No videos found</p>
            <p className="text-muted-foreground text-xs mt-1">
              Generate your first avatar video
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
