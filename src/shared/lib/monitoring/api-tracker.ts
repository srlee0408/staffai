/**
 * API 호출 추적 및 모니터링 시스템
 * 
 * 주요 역할:
 * 1. API 호출 성능 및 에러 추적 (Sentry 제거됨)
 * 2. 구조화된 로깅으로 디버깅 지원
 * 3. 사용자별 API 호출 메타데이터 관리
 * 4. 외부 서비스 호출 추적 (fal.ai, Supabase 등)
 * 
 * 핵심 특징:
 * - 콘솔 기반 로깅으로 개발 환경 디버깅 지원
 * - 에러 발생 시 상세 정보 수집 및 로깅
 * - API 타입별 분류된 추적 시스템
 * - 향후 다른 모니터링 시스템 통합 준비
 * 
 * 주의사항:
 * - 현재 Sentry가 제거되어 콘솔 로깅만 지원
 * - 프로덕션 환경에서는 적절한 로깅 시스템 필요
 * - 민감한 정보는 로그에서 제외
 */
import { UserFriendlyError } from '@/shared/lib/errors/user-friendly-errors';

export type ApiType = 'video_generation' | 'sound_generation' | 'image_brush';

export interface ApiCallMetadata {
  userId?: string;
  jobId?: string;
  endpoint?: string;
  requestSize?: number;
  responseSize?: number;
  [key: string]: unknown;
}

export class ApiTracker {
  static async trackApiCall<T>(
    apiType: ApiType,
    operation: string,
    metadata: ApiCallMetadata,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    // 개발 환경에서 API 호출 시작 로그
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Starting ${apiType}.${operation}`, {
        userId: metadata.userId,
        jobId: metadata.jobId,
        endpoint: metadata.endpoint,
      });
    }

    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;
      
      // 성공 로그
      console.log(`[API] ${apiType}.${operation} completed successfully`, {
        duration_ms: duration,
        user_id: metadata.userId,
        job_id: metadata.jobId,
        success: true,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // 에러 로그
      console.error(`[API] ${apiType}.${operation} failed`, {
        duration_ms: duration,
        user_id: metadata.userId,
        job_id: metadata.jobId,
        error_name: error instanceof Error ? error.name : 'Unknown',
        error_message: error instanceof Error ? error.message : String(error),
        success: false,
        ...metadata,
      });
      
      // UserFriendlyError가 아닌 경우 래핑
      if (!(error instanceof UserFriendlyError)) {
        const enhancedError = new Error(error instanceof Error ? error.message : String(error));
        enhancedError.name = 'ApiCallError';
        enhancedError.stack = error instanceof Error ? error.stack : undefined;
        (enhancedError as unknown as { apiType: string }).apiType = apiType;
        (enhancedError as unknown as { operation: string }).operation = operation;
        (enhancedError as unknown as { duration: number }).duration = duration;
        throw enhancedError;
      }
      
      throw error;
    }
  }
  
  static async trackExternalApiCall<T>(
    apiType: ApiType,
    externalService: string,
    endpoint: string,
    metadata: ApiCallMetadata,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const operation = `${externalService}_${endpoint.split('/').pop()}`;
    
    return this.trackApiCall(
      apiType,
      operation,
      {
        ...metadata,
        external_service: externalService,
        endpoint,
      },
      apiCall
    );
  }
}

export class FalAiTracker extends ApiTracker {
  static async trackFalApiCall<T>(
    apiType: ApiType,
    endpoint: string,
    metadata: ApiCallMetadata,
    apiCall: () => Promise<T>
  ): Promise<T> {
    return this.trackExternalApiCall(
      apiType,
      'fal_ai',
      endpoint,
      metadata,
      apiCall
    );
  }
}

export class SupabaseTracker extends ApiTracker {
  static async trackSupabaseCall<T>(
    operation: string,
    metadata: ApiCallMetadata,
    apiCall: () => Promise<T>
  ): Promise<T> {
    return this.trackExternalApiCall(
      'video_generation', // 기본값
      'supabase',
      operation,
      metadata,
      apiCall
    );
  }
}