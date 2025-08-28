/**
 * VoiceSelectionModal - 음성 선택 모달 컴포넌트
 * 
 * 주요 역할:
 * 1. 검색 기능으로 음성 필터링
 * 2. 언어, 성별, 연령, 트렌딩별 필터링
 * 3. 음성 미리보기 재생 기능
 * 4. 음성 선택 및 적용
 * 
 * 핵심 특징:
 * - 실시간 검색 및 필터링
 * - 음성 카드 레이아웃 (아바타, 이름, 태그)
 * - Voice Design 버튼으로 커스터마이징
 * - 현재 선택된 음성 하이라이트
 * 
 * 주의사항:
 * - 검색어 실시간 필터링 성능
 * - 오디오 재생 상태 관리
 * - 모달 외부 클릭 시 닫기
 */
'use client'

import { useState, useMemo, useRef } from 'react'
import { X, Search, Play, Pause, ChevronDown, Check } from 'lucide-react'

interface Voice {
  id: string
  name: string
  type: string // OpenAI Voice, etc.
  gender: 'male' | 'female'
  language: string
  age: 'young' | 'middle' | 'senior'
  tags: string[]
  avatarColor: string
  previewUrl?: string
}

interface VoiceSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedVoice: string
  onVoiceSelect: (voiceId: string) => void
}

// 음성 데이터 (실제로는 API에서 가져와야 함)
const VOICES: Voice[] = [
  {
    id: 'alloy',
    name: 'Alloy',
    type: 'OpenAI Voice',
    gender: 'female',
    language: 'English',
    age: 'young',
    tags: ['american', 'casual', 'young', 'female', 'en', 'conversational'],
    avatarColor: 'from-blue-400 to-purple-500'
  },
  {
    id: 'echo',
    name: 'Echo',
    type: 'OpenAI Voice',
    gender: 'male',
    language: 'English',
    age: 'middle',
    tags: ['american', 'casual', 'male', 'en', 'conversational'],
    avatarColor: 'from-green-400 to-blue-500'
  },
  {
    id: 'fable',
    name: 'Fable',
    type: 'OpenAI Voice',
    gender: 'male',
    language: 'English',
    age: 'young',
    tags: ['british', 'casual', 'young', 'male', 'en', 'conversational'],
    avatarColor: 'from-purple-400 to-pink-500'
  },
  {
    id: 'onyx',
    name: 'Onyx',
    type: 'OpenAI Voice',
    gender: 'male',
    language: 'English',
    age: 'middle',
    tags: ['american', 'casual', 'male', 'en', 'conversational'],
    avatarColor: 'from-gray-400 to-gray-600'
  },
  {
    id: 'nova',
    name: 'Nova',
    type: 'OpenAI Voice',
    gender: 'female',
    language: 'English',
    age: 'young',
    tags: ['american', 'casual', 'young', 'female', 'en', 'conversational'],
    avatarColor: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    type: 'OpenAI Voice',
    gender: 'female',
    language: 'English',
    age: 'middle',
    tags: ['american', 'casual', 'female', 'en', 'conversational'],
    avatarColor: 'from-pink-400 to-purple-500'
  },
  {
    id: 'rachel',
    name: 'Rachel',
    type: 'Premium Voice',
    gender: 'female',
    language: 'English',
    age: 'young',
    tags: ['american', 'casual', 'young', 'female', 'en', 'conversational'],
    avatarColor: 'from-rose-400 to-pink-500'
  }
]

// 필터 옵션
const FILTER_OPTIONS = {
  languages: [
    { id: 'all', label: 'All Languages' },
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'french', label: 'French' },
    { id: 'german', label: 'German' },
    { id: 'italian', label: 'Italian' },
    { id: 'portuguese', label: 'Portuguese' },
    { id: 'russian', label: 'Russian' },
    { id: 'turkish', label: 'Turkish' },
    { id: 'japanese', label: 'Japanese' },
    { id: 'korean', label: 'Korean' }
  ],
  genders: [
    { id: 'all', label: 'All Genders' },
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' }
  ],
  ages: [
    { id: 'all', label: 'All Ages' },
    { id: 'young', label: 'Young' },
    { id: 'middle', label: 'Middle Aged' },
    { id: 'old', label: 'Old' }
  ],
  trending: [
    { id: 'latest', label: 'Latest' },
    { id: 'trending', label: 'Trending' },
    { id: 'most-users', label: 'Most users' },
    { id: 'most-characters', label: 'Most characters generated' }
  ]
}

export function VoiceSelectionModal({
  isOpen,
  onClose,
  selectedVoice,
  onVoiceSelect
}: VoiceSelectionModalProps): React.JSX.Element | null {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<string>('all')
  const [selectedAge, setSelectedAge] = useState<string>('all')
  const [selectedTrending, setSelectedTrending] = useState<string>('latest')
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // 드롭다운 열림 상태
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // 필터링된 음성 목록 - 항상 호출되어야 함
  const filteredVoices = useMemo(() => {
    return VOICES.filter(voice => {
      const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           voice.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesLanguage = selectedLanguage === 'all' || voice.language.toLowerCase() === selectedLanguage
      const matchesGender = selectedGender === 'all' || voice.gender.toLowerCase() === selectedGender
      const matchesAge = selectedAge === 'all' || voice.age.toLowerCase() === selectedAge
      
      return matchesSearch && matchesLanguage && matchesGender && matchesAge
    })
  }, [searchQuery, selectedLanguage, selectedGender, selectedAge])

  // 모달이 열려있지 않으면 null 반환 (모든 훅 호출 후)
  if (!isOpen) return null

  // 커스텀 드롭다운 컴포넌트
  const CustomDropdown = ({ 
    id, 
    options, 
    selectedValue, 
    onSelect, 
    placeholder 
  }: {
    id: string
    options: Array<{ id: string; label: string }>
    selectedValue: string
    onSelect: (value: string) => void
    placeholder: string
  }): React.JSX.Element => {
    const isOpen = openDropdown === id
    const selectedOption = options.find(option => option.id === selectedValue)
    
    return (
      <div className="relative">
        <button
          className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-center gap-2 hover:bg-surface-tertiary transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setOpenDropdown(isOpen ? null : id)
          }}
        >
          <span>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto min-w-max"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <button
                key={option.id}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-surface-secondary transition-colors flex items-center justify-between whitespace-nowrap ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === options.length - 1 ? 'rounded-b-lg' : ''
                } ${
                  selectedValue === option.id ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(option.id)
                  setOpenDropdown(null)
                }}
              >
                <span>{option.label}</span>
                {selectedValue === option.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 음성 미리보기 재생/정지 핸들러
  const handlePlayPreview = (voiceId: string): void => {
    if (playingVoice === voiceId) {
      // 현재 재생 중인 음성을 정지
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setPlayingVoice(null)
    } else {
      // 다른 음성이 재생 중이면 정지
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // 새로운 음성 재생
      setPlayingVoice(voiceId)
      
      // 실제 구현에서는 각 음성의 previewUrl을 사용
      // 현재는 각 음성별 샘플 텍스트를 TTS로 생성한 URL 사용 (예시)
      const sampleText = "Hello, this is a preview of my voice. How do you like it?"
      // 현재 음성 정보 찾기
      const currentVoice = VOICES.find(v => v.id === voiceId)
      const sampleAudioUrl = currentVoice?.previewUrl || `https://api.openai.com/v1/audio/speech?model=tts-1&voice=${voiceId}&input=${encodeURIComponent(sampleText)}`
      
      if (audioRef.current) {
        audioRef.current.src = sampleAudioUrl
        audioRef.current.play().catch(error => {
          console.error('Audio play failed:', error)
          setPlayingVoice(null)
        })
      } else {
        const audio = new Audio(sampleAudioUrl)
        audioRef.current = audio
        
        audio.addEventListener('ended', () => {
          setPlayingVoice(null)
        })
        
        audio.addEventListener('error', () => {
          console.error('Audio load failed')
          setPlayingVoice(null)
        })
        
        audio.play().catch(error => {
          console.error('Audio play failed:', error)
          setPlayingVoice(null)
        })
      }
    }
  }

  // Voice Design 핸들러
  const handleVoiceDesign = (voiceId: string): void => {
    console.log(`Opening voice design for: ${voiceId}`)
    // TODO: Voice Design 모달 열기
  }

  // 음성 선택 핸들러
  const handleVoiceSelect = (voiceId: string): void => {
    // 재생 중인 오디오 정지
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlayingVoice(null)
    
    onVoiceSelect(voiceId)
    onClose()
  }

  // 모달 닫기 핸들러 (오디오 정지 포함)
  const handleClose = (): void => {
    // 재생 중인 오디오 정지
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlayingVoice(null)
    onClose()
  }

  // 모달 외부 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // 모달 내부 클릭 시 드롭다운 닫기
  const handleModalClick = (): void => {
    setOpenDropdown(null)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-surface rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-hidden"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Select Voice</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose a voice for your video narration</p>
          </div>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search voices..."
              className="w-full pl-10 pr-4 py-3 bg-surface-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-wrap gap-4">
            {/* Language Filter */}
            <div className="flex-1 min-w-[150px]">
              <CustomDropdown
                id="language"
                options={FILTER_OPTIONS.languages}
                selectedValue={selectedLanguage}
                onSelect={setSelectedLanguage}
                placeholder="Language"
              />
            </div>

            {/* Gender Filter */}
            <div className="flex-1 min-w-[150px]">
              <CustomDropdown
                id="gender"
                options={FILTER_OPTIONS.genders}
                selectedValue={selectedGender}
                onSelect={setSelectedGender}
                placeholder="Gender"
              />
            </div>

            {/* Age Filter */}
            <div className="flex-1 min-w-[150px]">
              <CustomDropdown
                id="age"
                options={FILTER_OPTIONS.ages}
                selectedValue={selectedAge}
                onSelect={setSelectedAge}
                placeholder="Age"
              />
            </div>

            {/* Trending Filter */}
            <div className="flex-1 min-w-[150px]">
              <CustomDropdown
                id="trending"
                options={FILTER_OPTIONS.trending}
                selectedValue={selectedTrending}
                onSelect={setSelectedTrending}
                placeholder="Trending"
              />
            </div>
          </div>
        </div>

        {/* Voice List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="space-y-3">
            {filteredVoices.map((voice) => (
              <div
                key={voice.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                  selectedVoice === voice.id
                    ? 'border-primary bg-primary/5'
                    : playingVoice === voice.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-border bg-surface-secondary hover:bg-surface-tertiary'
                }`}
              >
                {/* Voice Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar with Play Button */}
                  <button
                    className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${voice.avatarColor} flex items-center justify-center text-white font-semibold text-lg hover:scale-105 transition-transform group ${
                      playingVoice === voice.id ? 'animate-pulse ring-2 ring-green-400' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayPreview(voice.id)
                    }}
                    title={playingVoice === voice.id ? 'Stop preview' : 'Play preview'}
                  >
                    {playingVoice === voice.id ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <>
                        <span className="group-hover:opacity-0 transition-opacity">
                          {voice.name.charAt(0)}
                        </span>
                        <Play className="w-4 h-4 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </button>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{voice.name}</h3>
                      <span className="text-xs px-2 py-1 bg-surface-tertiary text-muted-foreground rounded-full">
                        {voice.type}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {voice.tags.slice(0, 6).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-surface text-muted-foreground rounded border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Voice Design Button */}
                  <button
                    className="px-3 py-1.5 text-xs font-medium bg-surface-tertiary text-muted-foreground rounded-lg hover:bg-surface-quaternary hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVoiceDesign(voice.id)
                    }}
                  >
                    Voice Design
                  </button>

                  {/* Select Button */}
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedVoice === voice.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-secondary text-foreground hover:bg-surface-tertiary border border-border'
                    }`}
                    onClick={() => handleVoiceSelect(voice.id)}
                  >
                    {selectedVoice === voice.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredVoices.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No voices found matching your criteria</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
