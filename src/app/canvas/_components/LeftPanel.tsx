import { ImageSection } from "./ImageSection";
import { EffectsSection } from "./EffectsSection";
import { EffectsGallery } from "./EffectsGallery";
import type { EffectTemplateWithMedia } from "@/shared/types/database";

interface LeftPanelProps {
  isPrompterOpen: boolean;
  onPrompterToggle: () => void;
  promptText: string;
  onPromptChange: (text: string) => void;
  uploadedImage?: string | null;
  onImageUpload?: (imageUrl: string) => void;
  onImageRemove?: () => void;
  generationError?: string | null;
  onEffectModalOpen?: () => void;
  selectedEffects?: EffectTemplateWithMedia[];
  onEffectRemove?: (effectId: string) => void;
  activeTab?: 'image' | 'video';
  onTabChange?: (tab: 'image' | 'video') => void;
}

export function LeftPanel({
  uploadedImage,
  onImageUpload,
  onImageRemove,
  generationError,
  onEffectModalOpen,
  selectedEffects,
  onEffectRemove,
  activeTab = 'image',
  onTabChange,
}: LeftPanelProps) {
  return (
    <div className="w-64 bg-background p-6 border-r border-border">
      {/* Image/Video Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-button transition-colors ${
            activeTab === 'image' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onTabChange?.('image')}
        >
          Image
        </button>
        <button 
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-button transition-colors ${
            activeTab === 'video' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-surface text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onTabChange?.('video')}
        >
          Video
        </button>
      </div>

      {/* Video Tab Content - 기존 컨텐츠 */}
      {activeTab === 'video' && (
        <>
          <ImageSection 
            uploadedImage={uploadedImage}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            activeTab={activeTab}
          />

          <EffectsSection 
            selectedEffects={selectedEffects}
            onEffectClick={onEffectModalOpen}
            onEffectRemove={onEffectRemove}
          />

          <EffectsGallery
            onEffectClick={onEffectModalOpen}
          />
        </>
      )}

      {/* Image Tab Content - Avatar Item 생성용 컨텐츠 */}
      {activeTab === 'image' && (
        <>
          <ImageSection 
            uploadedImage={uploadedImage}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            activeTab={activeTab}
            />

          <div className="mb-6">
            <h2 className="text-sm font-medium mb-3 text-foreground">Saved List</h2>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {/* 생성된 Avatar Item들이 여기에 표시됩니다 */}
              <div className="aspect-square rounded-lg overflow-hidden relative group bg-surface">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-xs">No avatar items</span>
                </div>
              </div>
            </div>
          </div>

          <EffectsSection 
            selectedEffects={selectedEffects}
            onEffectClick={onEffectModalOpen}
            onEffectRemove={onEffectRemove}
          />

          <EffectsGallery
            onEffectClick={onEffectModalOpen}
          />
        </>
      )}

      {/* Error Message */}
      {generationError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{generationError}</p>
        </div>
      )}
    </div>
  );
}