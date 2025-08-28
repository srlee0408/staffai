/**
 * ScriptCenterSlot - 스크립트 페이지 중앙 영상 결과 슬롯 컴포넌트
 * 
 * 주요 역할:
 * 1. 생성된 아바타 영상의 미리보기 표시
 * 2. 영상 생성 진행 상황 시각화
 * 3. 영상 재생 컨트롤 제공
 * 4. 즐겨찾기 토글 기능
 * 
 * 핵심 특징:
 * - AvatarItemGenerator와 동일한 크기의 단일 슬롯
 * - 생성 중 프로그레스 바 및 로딩 애니메이션
 * - 완료된 영상의 재생/일시정지 컨트롤
 * - 우상단 즐겨찾기 버튼
 * 
 * 주의사항:
 * - 영상 로딩 상태 및 에러 처리
 * - 반응형 레이아웃 고려
 * - 영상 품질에 따른 로딩 시간 차이
 */
'use client'

import { useState } from 'react'
import { Pin, Play, Pause, Loader2, X } from 'lucide-react'
import type { GeneratedVideo } from '@/shared/types/canvas'

interface ScriptCenterSlotProps {
  generatedVideo: GeneratedVideo | null
  isGenerating: boolean
  onToggleFavorite?: (videoId: string) => void
  onClearVideo?: () => void
}

export function ScriptCenterSlot({
  generatedVideo,
  isGenerating,
  onToggleFavorite,
  onClearVideo
}: ScriptCenterSlotProps): React.JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  
  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = (): void => {
    if (!generatedVideo) return
    
    setIsFavorite(!isFavorite)
    onToggleFavorite?.(generatedVideo.id)
  }
  
  // 영상 재생/일시정지 핸들러
  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying)
    // TODO: 실제 비디오 재생/일시정지 로직
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div 
        className="relative bg-surface rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors overflow-hidden w-full max-w-4xl"
        style={{ 
          height: 'calc(100vh - 240px)',
          aspectRatio: generatedVideo ? '16/9' : '16/9'
        }}
      >
        {/* 액션 버튼들 - 영상이 있을 때만 표시 */}
        {generatedVideo && (
          <>
            {/* 삭제/취소 버튼 */}
            <button
              className="absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center z-20 hover:bg-black/80 transition-colors"
              onClick={onClearVideo}
              title="Clear video"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* 즐겨찾기 버튼 */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-surface/90 backdrop-blur rounded-full flex items-center justify-center z-20 hover:bg-surface transition-colors"
              onClick={handleToggleFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Pin
                className={`w-5 h-5 ${
                  isFavorite || generatedVideo.isFavorite
                    ? "text-primary fill-current"
                    : "text-foreground/80"
                }`}
              />
            </button>
          </>
        )}

        {/* 생성 중 상태 */}
        {isGenerating && (
          <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-foreground font-medium mb-2">Generating Avatar Video</p>
            <p className="text-muted-foreground text-sm">This may take a few minutes...</p>
            
            {/* 프로그레스 바 */}
            <div className="w-64 bg-surface-secondary rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: '45%' }} // TODO: 실제 진행률로 교체
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">45% complete</p>
          </div>
        )}

        {/* 생성된 영상 표시 */}
        {generatedVideo && !isGenerating && (
          <>
            <video
              className="w-full h-full object-contain"
              poster={generatedVideo.thumbnail}
              controls={false}
              muted
              playsInline
            >
              <source src={generatedVideo.url} type="video/mp4" />
            </video>
            
            {/* 커스텀 재생 컨트롤 오버레이 */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                className="w-16 h-16 bg-black/70 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>
            
            {/* 영상 정보 오버레이 */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur rounded-md px-3 py-1.5">
              <p className="text-white text-sm font-medium">
                {generatedVideo.duration ? `${generatedVideo.duration}s • ` : ''}Generated
              </p>
            </div>
          </>
        )}

        {/* 빈 상태 */}
        {!generatedVideo && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-2">Ready to Generate</p>
            <p className="text-muted-foreground text-sm max-w-xs">
              Enter your script or upload audio file, then click Generate to create your avatar video
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
