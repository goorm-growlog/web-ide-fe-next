import Image from 'next/image'

interface SocialButtonProps {
  provider: 'kakao' | 'github'
  onClick?: () => void
  className?: string
}

const PROVIDER_STYLES = {
  kakao: 'bg-yellow-400 hover:bg-yellow-500',
  github: 'bg-black hover:bg-gray-800',
}

const PROVIDER_ICON = {
  kakao: '/kakao-logo.svg',
  github: '/github-logo.svg',
}

const PROVIDER_ALT = {
  kakao: '카카오 로그인',
  github: '깃허브 로그인',
}

const SocialButton = ({ provider, onClick, className }: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-12 w-12 items-center justify-center rounded-md transition-colors ${PROVIDER_STYLES[provider]} ${className ?? ''}`}
  >
    <Image
      src={PROVIDER_ICON[provider]}
      alt={PROVIDER_ALT[provider]}
      width={16}
      height={16}
      className={provider === 'kakao' ? 'brightness-0 filter' : ''}
    />
  </button>
)

export default SocialButton
