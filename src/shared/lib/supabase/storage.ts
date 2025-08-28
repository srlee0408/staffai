import { createServiceClient } from './service';

/**
 * Supabase Storage에 이미지를 업로드하고 공개 URL을 반환합니다.
 * 
 * 주요 역할:
 * 1. 서버 사이드에서 Service Client를 사용하여 RLS 우회
 * 2. 사용자별 폴더 구조로 이미지 저장
 * 3. 업로드 완료 후 공개 URL 반환
 * 
 * 핵심 특징:
 * - Service Client 사용으로 RLS 정책 우회
 * - 타임스탬프와 랜덤 문자열로 고유 파일명 생성
 * - user-uploads 버킷에 통일된 저장
 * 
 * 주의사항:
 * - 서버 사이드에서만 사용 가능 (Service Key 필요)
 * - 파일 크기 및 타입 검증은 호출하는 쪽에서 처리
 */
export async function uploadImage(file: File, userId: string = 'anonymous'): Promise<string> {
  try {
    // Service Client 생성 (RLS 우회)
    const serviceSupabase = createServiceClient();
    
    // 파일명 생성 (timestamp + random string)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    // 새로운 경로 구조: image/{userId}/{filename}
    const fileName = `image/${userId}/${timestamp}-${randomString}.${fileExt}`;

    // File을 ArrayBuffer로 변환 (Service Client에서 권장)
    const fileBuffer = await file.arrayBuffer();

    // Supabase Storage에 업로드 (Service Client 사용)
    const { error } = await serviceSupabase.storage
      .from('user-uploads') // 버킷 이름 통일
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    // 공개 URL 가져오기
    const { data: { publicUrl } } = serviceSupabase.storage
      .from('user-uploads')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Base64 이미지를 Blob으로 변환합니다.
 */
export function base64ToBlob(base64: string): Blob {
  // data:image/jpeg;base64, 부분 제거
  const base64Data = base64.split(',')[1];
  const mimeType = base64.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
  
  // base64를 binary로 변환
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: mimeType });
}

/**
 * Base64 이미지를 Supabase Storage에 업로드하고 URL을 반환합니다.
 */
export async function uploadBase64Image(base64: string, userId: string = 'anonymous'): Promise<string> {
  // Base64를 Blob으로 변환
  const blob = base64ToBlob(base64);
  
  // File 객체로 변환
  const file = new File([blob], 'upload.jpg', { type: blob.type });
  
  // 업로드 (동일한 uploadImage 함수 사용으로 자동으로 새 경로 구조 적용)
  return uploadImage(file, userId);
}

/**
 * Storage 경로를 공개 URL로 변환합니다.
 */
export function getPublicUrl(path: string): string {
  if (!path) return ''
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  
  // If path doesn't start with a bucket name, assume it's a relative path
  // Storage path format: bucket_name/path/to/file.ext
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Add media-asset bucket prefix if not already present
  const fullPath = cleanPath.startsWith('media-asset/') ? cleanPath : `media-asset/${cleanPath}`
  
  // Construct the full URL
  return `${supabaseUrl}/storage/v1/object/public/${fullPath}`
}