/**
 * Script Page - AI 아바타 영상 생성을 위한 스크립트 입력 페이지
 * 
 * 주요 역할:
 * 1. 텍스트 스크립트 입력 및 오디오 파일 임포트 기능
 * 2. 웹사이트 URL 분석을 통한 자동 스크립트 생성
 * 3. 생성된 아바타 영상의 미리보기 및 관리
 * 4. 영상 히스토리 및 즐겨찾기 관리
 * 
 * 핵심 특징:
 * - 3단 레이아웃: 좌측 입력 패널, 중앙 결과 슬롯, 우측 히스토리
 * - Script/Import Audio 탭 전환 기능
 * - URL 분석 기반 자동 스크립트 생성
 * - 실시간 문자 수 카운팅 (최대 4000자)
 * 
 * 주의사항:
 * - 스크립트 길이 제한 및 유효성 검사 필요
 * - 오디오 파일 형식 및 크기 제한 확인
 * - 생성 진행 상태 실시간 업데이트
 */
'use client'

import { useState } from 'react'
import { Header } from '@/shared/components/layout/Header'
import { CanvasControls } from '@/app/canvas/_components/CanvasControls'
import { ScriptLeftPanel } from '@/app/script/_components/ScriptLeftPanel'
import { ScriptCenterSlot } from '@/app/script/_components/ScriptCenterSlot'
import { ScriptHistoryPanel } from '@/app/script/_components/ScriptHistoryPanel'
import { VoiceSelectionModal } from './_components/VoiceSelectionModal'
import { AvatarSelectionModal } from './_components/AvatarSelectionModal'
import { LibraryModal } from '@/shared/components/modals/LibraryModal'
import { ProjectSelectorModal } from '@/shared/components/modals/ProjectSelectorModal'
import type { GeneratedVideo } from '@/shared/types/canvas'

export default function ScriptPage(): React.JSX.Element {
  // 스크립트 관련 상태
  const [scriptText, setScriptText] = useState<string>('')
  const [websiteUrl, setWebsiteUrl] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'script' | 'import-audio'>('script')
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  // 생성 관련 상태
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string>('6')
  
  // 다운로드 상태
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  
  // Script 페이지 전용 상태
  const [selectedRatio, setSelectedRatio] = useState<string>('9:16')
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  
  // 모달 상태
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false)
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false)
  const [showProjectSelector, setShowProjectSelector] = useState<boolean>(false)

  // URL 분석 핸들러
  const handleAnalyzeUrl = async (): Promise<void> => {
    if (!websiteUrl.trim()) return
    
    try {
      // TODO: 실제 URL 분석 API 호출
      console.log('Analyzing URL:', websiteUrl)
    } catch (error) {
      console.error('URL analysis failed:', error)
    }
  }

  // 생성 가능 여부 확인
  const canGenerate = (activeTab === 'script' && scriptText.trim().length > 0) || 
                     (activeTab === 'import-audio' && audioFile !== null)

  // 영상 생성 핸들러
  const handleGenerate = async (): Promise<void> => {
    if (!canGenerate) return
    
    setIsGenerating(true)
    try {
      // TODO: 실제 영상 생성 API 호출
      console.log('Generating avatar video with:', {
        script: scriptText,
        voice: selectedVoice,
        audioFile: audioFile?.name,
        duration: selectedDuration
      })
      
      setIsGenerating(false)
    } catch (error) {
      console.error('Video generation failed:', error)
      setIsGenerating(false)
    }
  }

  // 다운로드 핸들러
  const handleDownload = async (): Promise<void> => {
    if (!generatedVideo) return
    
    setIsDownloading(true)
    try {
      // TODO: 실제 다운로드 로직
      console.log('Downloading video:', generatedVideo.id)
      setIsDownloading(false)
    } catch (error) {
      console.error('Download failed:', error)
      setIsDownloading(false)
    }
  }

  // 저장 핸들러
  const handleSave = async (): Promise<void> => {
    if (!generatedVideo) return
    
    setIsSaving(true)
    try {
      // TODO: 실제 저장 로직
      console.log('Saving video:', generatedVideo.id)
      setIsSaving(false)
    } catch (error) {
      console.error('Save failed:', error)
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header 
        activePage="script"
        onLibraryClick={() => setIsLibraryModalOpen(true)}
        onEditClick={() => setShowProjectSelector(true)}
      />
      
      <div className="flex flex-1">
        {/* Left Panel - Script Input */}
        <ScriptLeftPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          scriptText={scriptText}
          onScriptChange={setScriptText}
          websiteUrl={websiteUrl}
          onWebsiteUrlChange={setWebsiteUrl}
          onAnalyzeUrl={handleAnalyzeUrl}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          audioFile={audioFile}
          onAudioFileChange={setAudioFile}
        />

        <div className="w-3/6 flex flex-col">
          {/* Center - Video Result Slot */}
          <ScriptCenterSlot
            generatedVideo={generatedVideo}
            isGenerating={isGenerating}
            onClearVideo={() => setGeneratedVideo(null)}
          />

          {/* Fixed Controls - Always visible at bottom */}
          <div className="flex justify-center p-4 bg-background">
            <CanvasControls
              selectedResolution="1080p"
              selectedSize="16:9"
              onGenerateClick={handleGenerate}
              canGenerate={canGenerate}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
              onDownloadClick={handleDownload}
              activeVideo={generatedVideo}
              isDownloading={isDownloading}
              hasUploadedImage={false}
              promptText=""
              showPromptInput={false}
              activeTab="video"
              // Script 페이지 전용 props
              isScriptPage={true}
              selectedRatio={selectedRatio}
              onRatioChange={setSelectedRatio}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              selectedAvatar={selectedAvatar}
                          onAvatarChange={setSelectedAvatar}
            onSaveClick={handleSave}
            isSaving={isSaving}
            onVoiceModalOpen={() => setIsVoiceModalOpen(true)}
            onAvatarModalOpen={() => setIsAvatarModalOpen(true)}
          />
          </div>
        </div>

        {/* Right Panel - History */}
        <ScriptHistoryPanel
          onVideoSelect={(video: GeneratedVideo) => setGeneratedVideo(video)}
        />

        {/* Modals */}
        <VoiceSelectionModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          selectedVoice={selectedVoice}
          onVoiceSelect={setSelectedVoice}
        />

        <AvatarSelectionModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          selectedAvatar={selectedAvatar}
          onAvatarSelect={setSelectedAvatar}
        />

        <LibraryModal
          isOpen={isLibraryModalOpen}
          onClose={() => setIsLibraryModalOpen(false)}
        />

        <ProjectSelectorModal
          isOpen={showProjectSelector}
          onClose={() => setShowProjectSelector(false)}
        />
      </div>
    </div>
  )
}
