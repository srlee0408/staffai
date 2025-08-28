/**
 * Canvas - Avatar 생성 캔버스 라우터 컴포넌트
 * 
 * 주요 역할:
 * 1. Image/Video 탭에 따른 적절한 컴포넌트 라우팅
 * 2. AvatarItemGenerator와 AvatarVideoGenerator 간 전환
 * 3. 공통 props 전달 및 상태 관리
 * 
 * 핵심 특징:
 * - Image 탭: AvatarItemGenerator (아바타 아이템 생성)
 * - Video 탭: AvatarVideoGenerator (아바타 비디오 생성)
 * - 탭별 특화된 UI/UX 제공
 * - 컴포넌트 분리로 코드 가독성 및 유지보수성 향상
 * 
 * 주의사항:
 * - 탭 전환 시 상태 초기화 여부 고려
 * - 각 컴포넌트별 필요한 props 정확히 전달
 * - 공통 상태는 상위 컴포넌트에서 관리
 */
import { AvatarItemGenerator } from "./AvatarItemGenerator";
import { AvatarVideoGenerator } from "./AvatarVideoGenerator";
import type { GeneratedVideo } from "@/shared/types/canvas";

interface CanvasProps {
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
  activeTab?: 'image' | 'video';
}

export function Canvas({
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
  activeTab = 'video',
}: CanvasProps) {
  // Image 탭일 때는 AvatarItemGenerator를 보여줌
  if (activeTab === 'image') {
    return (
      <AvatarItemGenerator />
    );
  }

  // Video 탭일 때는 AvatarVideoGenerator를 보여줌
  return (
    <AvatarVideoGenerator
      slotContents={slotContents}
      slotStates={slotStates}
      onVideoSelect={onVideoSelect}
      isGenerating={isGenerating}
      generatingProgress={generatingProgress}
      generatingJobIds={generatingJobIds}
      onRemoveContent={onRemoveContent}
      onSlotSelect={onSlotSelect}
      selectedSlotIndex={selectedSlotIndex}
      favoriteVideos={favoriteVideos}
      onToggleFavorite={onToggleFavorite}
    />
  );
}