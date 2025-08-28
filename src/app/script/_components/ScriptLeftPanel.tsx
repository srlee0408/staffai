/**
 * ScriptLeftPanel - 스크립트 입력 좌측 패널 컴포넌트
 * 
 * 주요 역할:
 * 1. Script/Import Audio 탭 전환 인터페이스
 * 2. 웹사이트 URL 분석 기능
 * 3. 텍스트 스크립트 입력 및 문자 수 카운팅
 * 4. 오디오 파일 업로드 및 관리
 * 5. AI 음성 선택 드롭다운
 * 
 * 핵심 특징:
 * - 탭 기반 UI로 스크립트/오디오 입력 방식 선택
 * - 실시간 문자 수 카운팅 (최대 4000자)
 * - 드래그 앤 드롭 오디오 파일 업로드
 * - 국가별 AI 음성 선택 인터페이스
 * 
 * 주의사항:
 * - 스크립트 길이 제한 및 경고 표시
 * - 지원되는 오디오 파일 형식 검증
 * - 음성 미리보기 기능 구현 필요
 */
'use client'

import { useState, useRef } from 'react'
import { Search, Upload, Play, ChevronDown, X } from 'lucide-react'

interface ScriptLeftPanelProps {
  activeTab: 'script' | 'import-audio'
  onTabChange: (tab: 'script' | 'import-audio') => void
  scriptText: string
  onScriptChange: (text: string) => void
  websiteUrl: string
  onWebsiteUrlChange: (url: string) => void
  onAnalyzeUrl: () => void
  selectedVoice: string
  onVoiceChange: (voice: string) => void
  audioFile: File | null
  onAudioFileChange: (file: File | null) => void
}

// 음성 데이터 (실제로는 API에서 가져와야 함)
const VOICE_DATA: Record<string, Array<{ name: string; gender: string }>> = {}

export function ScriptLeftPanel({
  activeTab,
  onTabChange,
  scriptText,
  onScriptChange,
  websiteUrl,
  onWebsiteUrlChange,
  onAnalyzeUrl,
  selectedVoice,
  onVoiceChange,
  audioFile,
  onAudioFileChange
}: ScriptLeftPanelProps): React.JSX.Element {
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 문자 수 계산
  const characterCount = scriptText.length
  const maxCharacters = 4000
  
  // 오디오 파일 업로드 핸들러
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      // 파일 형식 검증
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg']
      if (!allowedTypes.includes(file.type)) {
        alert('지원되지 않는 파일 형식입니다. MP3, WAV, M4A 파일만 업로드 가능합니다.')
        return
      }
      
      // 파일 크기 검증 (10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.')
        return
      }
      
      onAudioFileChange(file)
    }
  }
  
  // 오디오 파일 제거
  const handleRemoveAudio = (): void => {
    onAudioFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-2/6 border-r border-border flex flex-col">
      {/* Header with Tabs */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-button transition-colors ${
              activeTab === 'script'
                ? 'bg-surface text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onTabChange('script')}
          >
            Script
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-button transition-colors ${
              activeTab === 'import-audio'
                ? 'bg-surface text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onTabChange('import-audio')}
          >
            Import audio
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-3 flex flex-col">
        {activeTab === 'script' ? (
          <>
            {/* URL Analysis Section */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter product website URL"
                className="flex-1 bg-surface border border-border rounded-button px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                value={websiteUrl}
                onChange={(e) => onWebsiteUrlChange(e.target.value)}
              />
              <button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-button font-medium transition-colors whitespace-nowrap flex items-center gap-2"
                onClick={onAnalyzeUrl}
                disabled={!websiteUrl.trim()}
              >
                <Search className="w-4 h-4" />
                Analyze
              </button>
            </div>

            {/* Script Input */}
            <textarea
              className="w-full bg-surface border border-border rounded-button p-3 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Enter the text that needs AI dubbing here..."
              maxLength={maxCharacters}
              value={scriptText}
              onChange={(e) => onScriptChange(e.target.value)}
              style={{ height: 'calc(100vh - 300px)' }}
            />

            {/* Character Count and Voice Selection */}
            <div className="flex items-center justify-between mt-4">
              <div className={`text-sm ${characterCount > 3800 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                {characterCount}/{maxCharacters}
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">AI Voice</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-women-line text-sm text-muted-foreground"></i>
                  </div>
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                    >
                      <span className="text-sm">{selectedVoice}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {/* Voice Dropdown */}
                    {isVoiceDropdownOpen && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-surface rounded-lg shadow-lg w-[480px] max-h-[80vh] overflow-hidden">
                          <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Select Voice</h3>
                            <button
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => setIsVoiceDropdownOpen(false)}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                            <div className="space-y-6">
                              {Object.entries(VOICE_DATA).map(([country, voices]) => (
                                <div key={country} className="voice-country">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-sm font-medium text-foreground">{country}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    {voices.map((voice) => (
                                      <div
                                        key={voice.name}
                                        className="voice-option flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-tertiary cursor-pointer"
                                        onClick={() => {
                                          onVoiceChange(voice.name)
                                          setIsVoiceDropdownOpen(false)
                                        }}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <i className={`${voice.gender === 'female' ? 'ri-women-line' : 'ri-men-line'} text-muted-foreground`}></i>
                                          <span className="text-sm text-foreground">{voice.name}</span>
                                        </div>
                                        <button
                                          className="w-6 h-6 flex items-center justify-center hover:bg-surface rounded-full"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            // TODO: 음성 미리보기 재생
                                            console.log(`Playing ${voice.name} voice preview`)
                                          }}
                                        >
                                          <Play className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button className="w-8 h-8 flex items-center justify-center bg-surface-secondary hover:bg-surface-tertiary rounded-button transition-colors">
                    <Play className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Import Audio Tab */
          <div className="flex-1 flex flex-col">
            {audioFile ? (
              /* Audio File Selected */
              <div className="flex-1 flex flex-col">
                <div className="bg-surface border border-border rounded-button p-6 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-button flex items-center justify-center">
                        <i className="ri-music-line text-2xl text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={handleRemoveAudio}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    className="text-primary hover:text-primary/80 text-sm font-medium underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose different file
                  </button>
                </div>
              </div>
            ) : (
              /* Audio Upload Area */
              <div
                className="border-2 border-dashed border-border rounded-button flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                style={{ height: 'calc(100vh - 300px)' }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-surface rounded-button">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">Drop your audio file here or</p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    Browse files
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports MP3, WAV, M4A files up to 10MB
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleAudioUpload}
            />
          </div>
        )}
      </div>
    </div>
  )
}