interface QuickActionsBarProps {
  onGenerateClick?: () => void;
  isGenerating?: boolean;
  onMergeClick?: () => void;
}

export function QuickActionsBar({
  onGenerateClick,
  isGenerating,
  onMergeClick,
}: QuickActionsBarProps) {
  return (
    <div className="mt-auto space-y-2">
      <button
        onClick={onGenerateClick}
        disabled={isGenerating}
        className="btn-primary w-full"
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
      
      <button
        onClick={onMergeClick}
        className="btn-outline w-full"
      >
        Merge
      </button>
    </div>
  );
}