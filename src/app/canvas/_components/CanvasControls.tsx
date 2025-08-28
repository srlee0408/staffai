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
import { Wand2, Download, ChevronDown, Loader2, Brush, Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import type { GeneratedVideo } from "@/shared/types/canvas"
import { useState } from "react"

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
  // Script 페이지용 추가 props
  selectedRatio?: string
  onRatioChange?: (ratio: string) => void
  selectedVoice?: string
  onVoiceChange?: (voice: string) => void
  selectedAvatar?: string
  onAvatarChange?: (avatar: string) => void
  onSaveClick?: () => void
  isSaving?: boolean
  isScriptPage?: boolean
  onVoiceModalOpen?: () => void
  onAvatarModalOpen?: () => void
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
  // Script 페이지용 props
  selectedRatio = "9:16",
  onRatioChange,
  selectedVoice = "",
  selectedAvatar = "",
  onSaveClick,
  isSaving = false,
  isScriptPage = false,
  onVoiceModalOpen,
  onAvatarModalOpen,
}: CanvasControlsProps) {
  // 드롭다운 열림 상태
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // 드롭다운 옵션 정의
  const RATIO_OPTIONS = [
    { id: '9:16', label: '9:16' },
    { id: '16:9', label: '16:9' },
    { id: '1:1', label: '1:1' }
  ]

  const DURATION_OPTIONS = [
    { id: '6', label: '6s' },
    { id: '10', label: '10s' },
    { id: '15', label: '15s' },
    { id: '30', label: '30s' }
  ]

  const CANVAS_DURATION_OPTIONS = [
    { id: '6', label: '6s' },
    { id: '10', label: '10s' }
  ]

  // 커스텀 드롭다운 컴포넌트 (Primary 색상용)
  const PrimaryDropdown = ({ 
    id, 
    options, 
    selectedValue, 
    onSelect 
  }: {
    id: string
    options: Array<{ id: string; label: string }>
    selectedValue: string
    onSelect: (value: string) => void
  }): React.JSX.Element => {
    const isOpen = openDropdown === id
    const selectedOption = options.find(option => option.id === selectedValue)
    
    return (
      <div className="relative shrink-0">
        <button
          className="appearance-none bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors cursor-pointer h-12 flex items-center justify-center gap-2 min-w-[80px]"
          onClick={(e) => {
            e.stopPropagation()
            setOpenDropdown(isOpen ? null : id)
          }}
        >
          <span>{selectedOption?.label}</span>
          <ChevronDown className={`w-4 h-4 text-primary-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div 
            className="absolute bottom-full left-0 mb-1 bg-primary border border-primary-foreground/20 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto min-w-max"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <button
                key={option.id}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-primary/80 transition-colors flex items-center justify-between whitespace-nowrap ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === options.length - 1 ? 'rounded-b-lg' : ''
                } ${
                  selectedValue === option.id ? 'bg-primary/20' : ''
                } text-primary-foreground`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(option.id)
                  setOpenDropdown(null)
                }}
              >
                <span>{option.label}</span>
                {selectedValue === option.id && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 모달 내부 클릭 시 드롭다운 닫기
  const handleControlsClick = (): void => {
    setOpenDropdown(null)
  }

  // 음성 이름 가져오기 헬퍼 함수
  const getVoiceName = (voiceId: string): string => {
    const voiceNames: { [key: string]: string } = {
      'alloy': 'Alloy',
      'echo': 'Echo',
      'fable': 'Fable',
      'onyx': 'Onyx',
      'nova': 'Nova',
      'shimmer': 'Shimmer',
      'rachel': 'Rachel',
      'violet': 'Violet'
    }
    return voiceNames[voiceId] || voiceId.charAt(0).toUpperCase() + voiceId.slice(1)
  }

  // 아바타 이름 가져오기 헬퍼 함수
  const getAvatarName = (avatarId: string): string => {
    const avatarNames: { [key: string]: string } = {
      'avatar-1': 'Professional Woman',
      'avatar-2': 'Business Man',
      'avatar-3': 'Casual Woman',
      'avatar-4': 'Creative Man',
      'avatar-5': 'Senior Professional',
      'avatar-6': 'Young Professional'
    }
    return avatarNames[avatarId] || avatarId.replace('avatar-', 'Avatar ')
  }
  if (isScriptPage) {
    // Script 페이지용 레이아웃
    return (
      <div 
        className="bg-surface-secondary p-4 rounded-lg border border-border w-full max-w-6xl"
        onClick={handleControlsClick}
      >
        <div className="flex items-center justify-center gap-3 w-full">
          {/* 비율 선택 */}
          <PrimaryDropdown
            id="ratio"
            options={RATIO_OPTIONS}
            selectedValue={selectedRatio}
            onSelect={(value) => onRatioChange?.(value)}
          />

          {/* 음성 선택 */}
          <button
            className="bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors cursor-pointer h-12 flex items-center gap-2"
            onClick={() => onVoiceModalOpen?.()}
          >
            <span>{selectedVoice ? getVoiceName(selectedVoice) : 'No voice'}</span>
            <ChevronDown className="w-4 h-4 text-primary-foreground" />
          </button>

          {/* 아바타 선택 */}
          <button
            className="bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors cursor-pointer h-12 flex items-center gap-2"
            onClick={() => onAvatarModalOpen?.()}
          >
            <span>{selectedAvatar ? getAvatarName(selectedAvatar) : 'No avatar'}</span>
            <ChevronDown className="w-4 h-4 text-primary-foreground" />
          </button>

          {/* 시간 선택 */}
          <PrimaryDropdown
            id="duration"
            options={DURATION_OPTIONS}
            selectedValue={selectedDuration}
            onSelect={(value) => onDurationChange?.(value)}
          />

          {/* Generate 버튼 */}
          <Button
            className="flex items-center gap-2 px-12 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors h-12 shrink-0 min-w-[140px]"
            onClick={onGenerateClick}
            disabled={!canGenerate}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate</span>
          </Button>

          {/* 다운로드 버튼 */}
          <button 
            className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-surface-secondary shrink-0"
            onClick={onSaveClick}
            disabled={!activeVideo || isSaving}
            title={!activeVideo ? "Select a video to download" : "Download video"}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    )
  }

  // 기존 Canvas 페이지용 레이아웃
  return (
    <div 
      className="bg-surface-secondary p-4 rounded-lg border border-border w-full max-w-6xl"
      onClick={handleControlsClick}
    >
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
          <PrimaryDropdown
            id="canvas-duration"
            options={CANVAS_DURATION_OPTIONS}
            selectedValue={selectedDuration}
            onSelect={(value) => onDurationChange?.(value)}
          />
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