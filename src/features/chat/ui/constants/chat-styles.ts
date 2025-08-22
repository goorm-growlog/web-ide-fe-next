/**
 * 채팅 관련 공통 스타일 상수들
 */
export const CHAT_MESSAGE_STYLES = {
  // 기본 메시지 컨테이너 스타일
  baseMessage: 'mb-4 flex px-4',

  // 내 메시지 (오른쪽 정렬)
  ownMessage: 'justify-end',

  // 다른 사용자 메시지 (왼쪽 정렬, 아바타 간격)
  otherMessage: 'justify-start gap-1.5',

  // 메시지 내용 컨테이너 기본 스타일
  contentBase: 'flex min-w-0 flex-col gap-1.5',

  // 내 메시지 내용 (오른쪽 정렬, 반응형 최대 너비)
  ownContent: 'max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] items-end',

  // 다른 사용자 메시지 내용 (왼쪽 정렬, 반응형 최대 너비)
  otherContent: 'max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] items-start',

  // 메시지 버블 기본 스타일
  bubbleBase: 'w-full break-words rounded-2xl px-3.5 py-2.5 shadow-sm',

  // 내 메시지 버블 (파란색, 오른쪽 상단 모서리 각짐)
  ownBubble: 'rounded-tr-sm bg-primary text-primary-foreground',

  // 다른 사용자 메시지 버블 (회색, 왼쪽 상단 모서리 각짐)
  otherBubble: 'rounded-tl-sm bg-muted text-muted-foreground',

  // 메시지 텍스트 스타일
  messageText: 'm-0 text-sm leading-relaxed',

  // 시간 표시 스타일
  timestamp: 'mt-0.5 text-xs text-muted-foreground',
} as const
