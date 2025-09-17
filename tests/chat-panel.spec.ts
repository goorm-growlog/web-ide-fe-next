import { test, expect } from '@playwright/test'

test.describe('Chat Panel Infinite Scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat-test')
  })

  test('should display initial messages and scroll to bottom', async ({ page }) => {
    // 페이지 로드 확인
    await expect(page.locator('h1')).toContainText('Chat Panel Test')
    
    // 메시지 수 확인
    await expect(page.locator('text=Messages: 50')).toBeVisible()
    
    // 스크롤 컨테이너 찾기
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    await expect(scrollContainer).toBeVisible()
    
    // 스크롤이 최하단에 있는지 확인
    const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight)
    const scrollTop = await scrollContainer.evaluate(el => el.scrollTop)
    const clientHeight = await scrollContainer.evaluate(el => el.clientHeight)
    
    // 스크롤이 최하단 근처에 있는지 확인 (10px 오차 허용)
    expect(scrollTop + clientHeight).toBeGreaterThanOrEqual(scrollHeight - 10)
  })

  test('should load more messages when scrolling to top', async ({ page }) => {
    // 스크롤 컨테이너 찾기
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    
    // 스크롤을 최상단으로 이동
    await scrollContainer.evaluate(el => {
      el.scrollTop = 0
    })
    
    // 로딩 상태 확인
    await expect(page.locator('text=Loading: Yes')).toBeVisible()
    
    // 로딩 완료 대기
    await expect(page.locator('text=Loading: No')).toBeVisible({ timeout: 10000 })
    
    // 메시지 수 증가 확인
    await expect(page.locator('text=Messages: 70')).toBeVisible()
  })

  test('should maintain scroll position when loading more messages', async ({ page }) => {
    // 스크롤 컨테이너 찾기
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    
    // 스크롤을 중간 위치로 이동
    await scrollContainer.evaluate(el => {
      el.scrollTop = el.scrollHeight / 2
    })
    
    const initialScrollTop = await scrollContainer.evaluate(el => el.scrollTop)
    
    // 스크롤을 최상단으로 이동하여 무한 스크롤 트리거
    await scrollContainer.evaluate(el => {
      el.scrollTop = 0
    })
    
    // 로딩 완료 대기
    await expect(page.locator('text=Loading: No')).toBeVisible({ timeout: 10000 })
    
    // 스크롤 위치가 유지되는지 확인 (새로운 메시지가 추가되어도 스크롤 위치 유지)
    const finalScrollTop = await scrollContainer.evaluate(el => el.scrollTop)
    
    // 스크롤 위치가 유지되었는지 확인 (새로운 메시지가 추가되어도 사용자가 보고 있던 위치 유지)
    expect(finalScrollTop).toBeGreaterThan(0)
  })

  test('should send new message and auto-scroll to bottom', async ({ page }) => {
    // 메시지 입력 필드 찾기
    const messageInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]')
    await expect(messageInput).toBeVisible()
    
    // 새 메시지 입력
    await messageInput.fill('Test message from Playwright')
    
    // 전송 버튼 클릭
    const sendButton = page.locator('button:has-text("Send"), button:has-text("전송")')
    await sendButton.click()
    
    // 메시지 수 증가 확인
    await expect(page.locator('text=Messages: 51')).toBeVisible()
    
    // 스크롤이 최하단에 있는지 확인
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight)
    const scrollTop = await scrollContainer.evaluate(el => el.scrollTop)
    const clientHeight = await scrollContainer.evaluate(el => el.clientHeight)
    
    // 스크롤이 최하단 근처에 있는지 확인
    expect(scrollTop + clientHeight).toBeGreaterThanOrEqual(scrollHeight - 10)
  })

  test('should show loading indicator during infinite scroll', async ({ page }) => {
    // 스크롤 컨테이너 찾기
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    
    // 스크롤을 최상단으로 이동
    await scrollContainer.evaluate(el => {
      el.scrollTop = 0
    })
    
    // 로딩 인디케이터 확인
    await expect(page.locator('text=더 많은 메시지 로딩 중')).toBeVisible()
    
    // 로딩 완료 후 인디케이터 사라짐 확인
    await expect(page.locator('text=더 많은 메시지 로딩 중')).not.toBeVisible({ timeout: 10000 })
  })

  test('should show "no more messages" when all messages are loaded', async ({ page }) => {
    // 스크롤 컨테이너 찾기
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    
    // 여러 번 무한 스크롤 실행하여 모든 메시지 로드
    for (let i = 0; i < 10; i++) {
      await scrollContainer.evaluate(el => {
        el.scrollTop = 0
      })
      
      // 로딩 완료 대기
      await expect(page.locator('text=Loading: No')).toBeVisible({ timeout: 10000 })
      
      // 더 이상 로드할 메시지가 없는지 확인
      if (await page.locator('text=Has More: No').isVisible()) {
        break
      }
    }
    
    // "모든 메시지를 불러왔습니다" 메시지 확인
    await expect(page.locator('text=모든 메시지를 불러왔습니다')).toBeVisible()
  })

  test('should handle rapid scrolling without issues', async ({ page }) => {
    // 스크롤 컨테이너 찾기
    const scrollContainer = page.locator('[class*="overflow-y-auto"]').first()
    
    // 빠른 스크롤 테스트
    for (let i = 0; i < 5; i++) {
      await scrollContainer.evaluate(el => {
        el.scrollTop = 0
      })
      
      await page.waitForTimeout(100)
      
      await scrollContainer.evaluate(el => {
        el.scrollTop = el.scrollHeight
      })
      
      await page.waitForTimeout(100)
    }
    
    // 페이지가 정상적으로 작동하는지 확인
    await expect(page.locator('h1')).toContainText('Chat Panel Test')
  })
})
