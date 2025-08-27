'use client'

import { VideoEditorProviders } from './_context/Providers';
import VideoEditorClient from './_components/VideoEditorClient';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';

/**
 * Video Editor 페이지 - 인증된 사용자만 접근 가능
 * 
 * 주요 역할:
 * 1. 비디오 편집 도구 제공
 * 2. 프로젝트 관리 및 저장
 * 3. 렌더링 및 내보내기 기능
 * 
 * 핵심 특징:
 * - AuthGuard로 로그인한 사용자만 접근 가능
 * - Context Provider로 상태 관리
 * - 클라이언트 사이드 렌더링
 */
export default function VideoEditorPage() {
  return (
    <AuthGuard>
      <VideoEditorProviders>
        <VideoEditorClient />
      </VideoEditorProviders>
    </AuthGuard>
  );
}