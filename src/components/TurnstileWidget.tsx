'use client'

import { Turnstile } from '@marsidev/react-turnstile'

interface Props {
  onVerify: (token: string) => void
  onExpire?: () => void
  className?: string
}

export function TurnstileWidget({ onVerify, onExpire, className }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (!siteKey) return null
  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onVerify}
      onExpire={onExpire}
      options={{ theme: 'light', size: 'normal' }}
      className={className}
    />
  )
}
