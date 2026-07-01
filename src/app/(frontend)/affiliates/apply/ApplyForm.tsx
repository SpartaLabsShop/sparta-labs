'use client'

import { useState } from 'react'
import { submitAffiliateApplication } from './actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TurnstileWidget } from '@/components/TurnstileWidget'

export function ApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!turnstileToken) { setError('Please complete the verification challenge.'); return }
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('turnstileToken', turnstileToken)
    const result = await submitAffiliateApplication(formData)
    
    if (!result.success) {
      setError(result.error || 'An error occurred while submitting your application.')
      setIsSubmitting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name / Brand Name *
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="How should we refer to you?"
          />
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label htmlFor="promotionMethods" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            How do you plan to promote us? *
          </label>
          <textarea
            id="promotionMethods"
            name="promotionMethods"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="e.g. YouTube videos, Instagram posts, Blog reviews..."
          />
        </div>

        <div>
          <label htmlFor="estimatedMonthlyReach" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estimated Monthly Reach
          </label>
          <select
            id="estimatedMonthlyReach"
            name="estimatedMonthlyReach"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="<1k">Less than 1,000</option>
            <option value="1k-10k">1,000 - 10,000</option>
            <option value="10k-100k">10,000 - 100,000</option>
            <option value="100k+">100,000+</option>
          </select>
        </div>

        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Niche / Audience
          </label>
          <input
            type="text"
            id="niche"
            name="niche"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="e.g. Fitness, Self-improvement, Fashion..."
          />
        </div>

        <div>
          <label htmlFor="whyJoin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Why do you want to partner with us?
          </label>
          <textarea
            id="whyJoin"
            name="whyJoin"
            rows={2}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Social Links (Optional)</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="social_instagram" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Instagram URL</label>
              <input type="url" id="social_instagram" name="social_instagram" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="social_youtube" className="block text-xs font-medium text-gray-500 dark:text-gray-400">YouTube URL</label>
              <input type="url" id="social_youtube" name="social_youtube" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="social_tiktok" className="block text-xs font-medium text-gray-500 dark:text-gray-400">TikTok URL</label>
              <input type="url" id="social_tiktok" name="social_tiktok" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="social_twitter" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Twitter/X URL</label>
              <input type="url" id="social_twitter" name="social_twitter" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-start pt-4">
          <div className="flex h-5 items-center">
            <input
              id="agreedToTerms"
              name="agreedToTerms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreedToTerms" className="font-medium text-gray-700 dark:text-gray-300">
              I agree to the Affiliate Terms and Conditions *
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              By applying, you agree to comply with our promotional guidelines.
            </p>
          </div>
        </div>
      </div>

      <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !turnstileToken}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-900"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  )
}
