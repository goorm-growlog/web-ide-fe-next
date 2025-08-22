import SocialButton from '@/features/auth/ui/social-button'

interface SocialLoginProps {
  onSocialLogin: (provider: string) => void
}

const SocialLogin = ({ onSocialLogin }: SocialLoginProps) => (
  <div className="flex justify-center gap-4">
    <SocialButton provider="github" onClick={() => onSocialLogin('github')} />
    <SocialButton provider="kakao" onClick={() => onSocialLogin('kakao')} />
  </div>
)

export default SocialLogin
