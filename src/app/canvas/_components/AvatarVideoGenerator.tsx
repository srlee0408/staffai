/**
 * AvatarVideoGenerator - Avatar Video 생성 컴포넌트
 * 
 * 주요 역할:
 * 1. 4개 슬롯 시스템으로 이미지/영상 콘텐츠 관리
 * 2. AI 영상 생성 과정의 시각적 진행상황 표시
 * 3. 생성된 영상의 미리보기 및 선택 인터페이스 제공
 * 4. 즐겨찾기, 다운로드, 삭제 등 영상 관리 기능
 * 
 * 핵심 특징:
 * - 4x1 그리드 레이아웃으로 명확한 슬롯 구조 제공
 * - 각 슬롯별 상태 관리 (empty, generating, completed)
 * - 실시간 생성 진행률 및 예상 시간 표시
 * - Avatar Video 생성에 특화된 UI/UX
 * 
 * 주의사항:
 * - 슬롯 인덱스와 콘텐츠 배열의 동기화 중요
 * - 생성 중인 영상의 jobId와 진행률 매핑 관리
 * - 즐겨찾기 상태는 Set으로 관리하여 성능 최적화
 * - 영상 선택 시 미리보기 동기화 필요
 */
import { Pin, X } from "lucide-react";
import Image from "next/image";
import { CanvasHistoryPanel } from "./CanvasHistoryPanel";
import { VideoGenerationProgress } from "./VideoGenerationProgress";
import type { GeneratedVideo } from "@/shared/types/canvas";

interface AvatarVideoGeneratorProps {
  slotContents?: Array<{type: 'image' | 'video', data: string | GeneratedVideo} | null>;
  slotStates?: Array<'empty' | 'generating' | 'completed'>;
  onVideoSelect?: (video: GeneratedVideo) => void;
  isGenerating?: boolean;
  generatingProgress?: Map<string, number>;
  generatingJobIds?: Map<string, string>;
  onRemoveContent?: (index: number, type: 'image' | 'video') => void;
  onSlotSelect?: (index: number, video: GeneratedVideo | null) => void;
  selectedSlotIndex?: number | null;
  favoriteVideos?: Set<string>;
  onToggleFavorite?: (videoId: string) => void;
}

export function AvatarVideoGenerator({
  slotContents = [null, null, null, null],
  slotStates = ['empty', 'empty', 'empty', 'empty'],
  onVideoSelect,
  isGenerating = false,
  generatingProgress = new Map(),
  generatingJobIds = new Map(),
  onRemoveContent,
  onSlotSelect,
  selectedSlotIndex,
  favoriteVideos = new Set(),
  onToggleFavorite,
}: AvatarVideoGeneratorProps) {
  return (
    <div className="flex-1 flex bg-background">
      <div className="flex-1 flex flex-col">
        {/* Main Images - 4 Columns */}
        <div className="grid grid-cols-4 gap-4 flex-1 p-4">
          {[0, 1, 2, 3].map((index) => {
            // 슬롯 콘텐츠 가져오기
            const content = slotContents[index];
            let displayContent: { type: 'video' | 'image' | 'empty', data?: GeneratedVideo | string } = { type: 'empty' };
            
            if (content) {
              displayContent = {
                type: content.type,
                data: content.data
              };
            }
            
            // 현재 슬롯의 생성 진행률 찾기
            const progress = generatingProgress.get(index.toString()) || 0;
            const isGeneratingThisSlot = slotStates[index] === 'generating' || 
              (isGenerating && generatingProgress.has(index.toString()) && progress < 100);
            
            return (
              <div
                key={`slot-${index}`}
                className={`relative bg-surface rounded-lg overflow-hidden h-full cursor-pointer transition-all group ${
                  selectedSlotIndex === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  if (displayContent.type === 'video' && displayContent.data) {
                    onSlotSelect?.(index, displayContent.data as GeneratedVideo);
                  } else {
                    onSlotSelect?.(index, null);
                  }
                }}
              >
              {/* Pin button - 비디오가 있는 슬롯에만 표시 */}
              {displayContent.type === 'video' && displayContent.data && (
                <button
                  className="absolute top-4 left-4 w-10 h-10 bg-surface/90 backdrop-blur rounded-full flex items-center justify-center z-20 hover:bg-surface transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.((displayContent.data as GeneratedVideo).id);
                  }}
                  aria-label={
                    favoriteVideos.has((displayContent.data as GeneratedVideo).id) || 
                    (displayContent.data as GeneratedVideo).isFavorite 
                      ? "Remove from favorites" 
                      : "Add to favorites"
                  }
                >
                  <Pin
                    className={`w-5 h-5 ${
                      favoriteVideos.has((displayContent.data as GeneratedVideo).id) || 
                      (displayContent.data as GeneratedVideo).isFavorite
                        ? "text-primary fill-current"
                        : "text-foreground/80"
                    }`}
                  />
                </button>
              )}
              
              {/* X button for removing content */}
              {displayContent.type !== 'empty' && onRemoveContent && (
                <button
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayContent.type === 'video' && displayContent.data) {
                      onRemoveContent(index, 'video');
                    } else if (displayContent.type === 'image' && displayContent.data) {
                      onRemoveContent(index, 'image');
                    }
                  }}
                  aria-label="Remove content"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
              
              
              {/* 비디오 또는 이미지 표시 */}
              {displayContent.type === 'video' && displayContent.data ? (
                <video
                  src={(displayContent.data as GeneratedVideo).url}
                  className="w-full h-full object-contain"
                  controls
                  muted
                  playsInline
                />
              ) : displayContent.type === 'image' && displayContent.data ? (
                <>
                  <Image
                    src={displayContent.data as string}
                    alt={`Avatar video ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    fill
                    sizes="(max-width: 1024px) 25vw, 25vw"
                    priority={index === 0}
                  />
                  {/* Ready to Generate 오버레이 - generating이 아닌 이미지에만 표시 */}
                  {!isGeneratingThisSlot && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/70 px-3 py-1.5 rounded-md text-white text-sm font-medium">
                        Ready to Generate
                      </div>
                    </div>
                  )}
                </>
              ) : null}
              
              {/* 프로그레스 오버레이 */}
              <VideoGenerationProgress 
                progress={progress}
                isVisible={isGeneratingThisSlot}
                jobId={generatingJobIds.get(index.toString())}
              />
            </div>
            );
          })}
        </div>


      </div>

      {/* Right History Panel */}
      <CanvasHistoryPanel
        onVideoSelect={onVideoSelect}
        slotContents={slotContents}
      />
    </div>
  );
}
