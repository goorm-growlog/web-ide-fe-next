import Image from 'next/image'
import Link from 'next/link'

interface LogoLinkProps {
  width?: number
  height?: number
  className?: string
}

const LogoLink = ({ width = 100, height = 20, className }: LogoLinkProps) => {
  return (
    <Link href="/" className={`inline-block ${className || ''}`}>
      <Image
        src="/logo.svg"
        alt="GrowLog"
        width={width}
        height={height}
        className="transition-opacity hover:opacity-80"
      />
    </Link>
  )
}

export default LogoLink
