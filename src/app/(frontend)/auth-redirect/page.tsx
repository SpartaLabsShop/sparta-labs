'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const to = searchParams.get('to') || '/account'
    router.replace(to)
    router.refresh()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Signing you in...</p>
      </div>
    </div>
  )
}

export default function AuthRedirectPage() {
  return (
    <Suspense>
      <AuthRedirectContent />
    </Suspense>
  )
}
