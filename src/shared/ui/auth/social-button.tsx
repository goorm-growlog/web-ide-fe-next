import Image from 'next/image'

interface SocialButtonProps {
  provider: 'kakao' | 'github'
  onClick?: () => void
  className?: string
}

const PROVIDER_COLORS = {
  kakao: '#FEE500',
  github: '#24292e',
} as const

const SocialButton = ({ provider, onClick, className }: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-12 w-12 items-center justify-center rounded-md transition-colors hover:opacity-80 ${className ?? ''}`}
    style={{ backgroundColor: PROVIDER_COLORS[provider] }}
  >
    <Image
      src={`/${provider}-logo.svg`}
      alt={`${provider} 로그인`}
      width={20}
      height={20}
      className={provider === 'kakao' ? 'brightness-0 filter' : ''}
    />
  </button>
)

export default SocialButton
