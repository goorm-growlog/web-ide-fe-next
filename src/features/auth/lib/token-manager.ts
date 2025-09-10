'use client'

/**
 * 백엔드 중심 토큰 관리
 * NextAuth는 소셜 로그인 상태만 관리, 실제 API 토큰은 별도 관리
 */

interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

class TokenManager {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private tokenExpiry: number | null = null

  /**
   * 토큰 저장 (로그인 성공 시)
   */
  setTokens(tokenData: TokenData) {
    this.accessToken = tokenData.accessToken
    this.refreshToken = tokenData.refreshToken

    // 만료 시간 계산 (기본 1시간)
    const expiresIn = tokenData.expiresIn || 3600
    this.tokenExpiry = Date.now() + expiresIn * 1000

    // 로컬스토리지에 저장 (선택사항)
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'auth_tokens',
        JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          expiresAt: this.tokenExpiry,
        }),
      )
    }

    // 토큰 업데이트 이벤트 발생
    this.dispatchTokenUpdateEvent()
  }

  /**
   * 현재 유효한 액세스 토큰 반환
   */
  async getAccessToken(): Promise<string | null> {
    // 메모리에 토큰이 없으면 로컬스토리지에서 복원
    if (!this.accessToken && typeof window !== 'undefined') {
      this.restoreFromStorage()
    }

    // 토큰이 없으면 null 반환
    if (!this.accessToken) {
      return null
    }

    // 토큰이 만료되었으면 갱신 시도
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken()
      if (!refreshed) {
        return null
      }
    }

    return this.accessToken
  }

  /**
   * 토큰 만료 확인
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return false
    return Date.now() >= this.tokenExpiry - 30000 // 30초 여유
  }

  /**
   * 토큰 갱신
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      this.clearTokens()
      return false
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()

      if (data.success && data.data) {
        this.setTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken || this.refreshToken,
          expiresIn: data.data.expiresIn,
        })
        return true
      }

      throw new Error('Invalid refresh response')
    } catch {
      this.clearTokens()
      return false
    }
  }

  /**
   * 로컬스토리지에서 토큰 복원
   */
  private restoreFromStorage() {
    try {
      const stored = localStorage.getItem('auth_tokens')
      if (stored) {
        const data = JSON.parse(stored)
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
        this.tokenExpiry = data.expiresAt
      }
    } catch {
      this.clearTokens()
    }
  }

  /**
   * 토큰 삭제 (로그아웃 시)
   */
  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    this.tokenExpiry = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens')
    }

    this.dispatchTokenUpdateEvent()
  }

  /**
   * 토큰 업데이트 이벤트 발생
   */
  private dispatchTokenUpdateEvent() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auth:token-updated', {
          detail: { accessToken: this.accessToken },
        }),
      )
    }
  }

  /**
   * 현재 토큰 상태 확인
   */
  hasValidToken(): boolean {
    return !!this.accessToken && !this.isTokenExpired()
  }
}

// 싱글톤 인스턴스
export const tokenManager = new TokenManager()

// 토큰 관리 훅
export function useTokenManager() {
  return {
    setTokens: (tokens: TokenData) => tokenManager.setTokens(tokens),
    getAccessToken: () => tokenManager.getAccessToken(),
    clearTokens: () => tokenManager.clearTokens(),
    hasValidToken: () => tokenManager.hasValidToken(),
  }
}
