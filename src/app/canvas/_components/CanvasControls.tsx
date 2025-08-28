/**
 * CanvasControls - 캔버스 제어 패널 컴포넌트
 * 
 * 주요 역할:
 * 1. AI 영상 생성 프로세스 시작을 위한 Generate 버튼
 * 2. 영상 지속시간 선택 드롭다운 (6초/10초 옵션)
 * 3. 생성된 영상 다운로드 기능
 * 4. Image Brush 편집 도구 진입점
 * 
 * 핵심 특징:
 * - 조건부 버튼 활성화 (이미지 업로드 및 효과 선택 시)
 * - 다운로드 중 로딩 상태 표시
 * - 선택된 영상이 있을 때만 다운로드 버튼 활성화
 * - Image Brush는 업로드된 이미지가 있을 때만 표시
 * 
 * 주의사항:
 * - canGenerate 상태는 상위 컴포넌트에서 계산된 값 사용
 * - 영상 지속시간은 AI 모델의 제약사항에 따라 제한
 * - 다운로드 진행 중에는 중복 클릭 방지
 */
import { Wand2, Download, ChevronDown, Loader2, Brush } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import type { GeneratedVideo } from "@/shared/types/canvas"

interface CanvasControlsProps {
  selectedResolution: string
  selectedSize: string
  onPromptModalOpen?: () => void
  onGenerateClick?: () => void
  canGenerate?: boolean
  selectedDuration?: string
  onDurationChange?: (duration: string) => void
  onDownloadClick?: () => void
  activeVideo?: GeneratedVideo | null
  isDownloading?: boolean
  onImageBrushOpen?: () => void
  hasUploadedImage?: boolean
  promptText?: string
  onPromptChange?: (text: string) => void
  showPromptInput?: boolean
  activeTab?: 'image' | 'video'
}

export function CanvasControls({
  onPromptModalOpen,
  onGenerateClick,
  canGenerate = false,
  selectedDuration = "6",
  onDurationChange,
  onDownloadClick,
  activeVideo,
  isDownloading = false,
  onImageBrushOpen,
  hasUploadedImage = false,
  promptText = "",
  onPromptChange,
  showPromptInput = false,
  activeTab = 'video',
}: CanvasControlsProps) {
  return (
    <div className="bg-surface-secondary p-4 rounded-lg border border-border w-full max-w-6xl">
      {/* Single Row: Prompt Input + Generate Button + Image Brush + Duration + Download */}
      <div className="flex items-stretch gap-3 w-full">
        {showPromptInput && (
          <div className="flex-1 min-w-0">
            <textarea
              className="w-full bg-surface text-foreground text-sm placeholder-muted-foreground resize-none outline-none border border-border rounded-lg px-4 py-3 min-h-[48px] focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              rows={1}
              placeholder="Enter a prompt..."
              value={promptText}
              onChange={(e) => onPromptChange?.(e.target.value)}
              maxLength={500}
              style={{ minHeight: '48px' }}
            />
          </div>
        )}
        
        <Button
          className="flex items-center gap-2 px-12 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors h-12 shrink-0 min-w-[140px]"
          onClick={onGenerateClick || onPromptModalOpen}
          disabled={!canGenerate}
        >
          <Wand2 className="w-4 h-4" />
          <span>Generate</span>
        </Button>

        {/* Duration selector - only show for video tab */}
        {activeTab === 'video' && (
          <div className="relative shrink-0">
            <select 
              className="appearance-none bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2 pr-8 hover:bg-primary/90 transition-colors cursor-pointer h-12"
              value={selectedDuration}
              onChange={(e) => onDurationChange?.(e.target.value)}
            >
              <option value="6">6s</option>
              <option value="10">10s</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        )}

        <Button
          className="flex items-center gap-2 px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-12 shrink-0"
          onClick={onImageBrushOpen}
          disabled={!hasUploadedImage}
          variant="ghost"
          title={!hasUploadedImage ? "Upload an image first" : "Edit image with AI brush"}
        >
          <Brush className="w-4 h-4" />
          <span>Image Brush</span>
        </Button>

        <button 
          className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-surface-secondary shrink-0"
          onClick={onDownloadClick}
          disabled={!activeVideo || isDownloading}
          title={!activeVideo ? "Select a video to download" : "Download video"}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}