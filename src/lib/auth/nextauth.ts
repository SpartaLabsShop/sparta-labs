import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyTurnstile } from '@/lib/turnstile'
import type { User } from '@/payload-types'
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { loginLimiter, getIp } from '@/lib/ratelimit'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile Token', type: 'text' },
        autoLoginToken: { label: 'Auto Login Token', type: 'text' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null

        if (loginLimiter) {
          const ip = getIp(new Headers(req?.headers as Record<string, string> | undefined))
          const { success } = await loginLimiter.limit(ip)
          if (!success) throw new Error('Too many attempts. Please try again later.')
        }

        // Auto-login path: used immediately after registration (server-signed, short-lived)
        if (credentials.autoLoginToken) {
          try {
            const decoded = jwtVerify(
              credentials.autoLoginToken,
              process.env.PAYLOAD_SECRET!,
            ) as { email: string; sub: string }
            if (
              decoded.sub !== 'auto-login' ||
              decoded.email?.toLowerCase() !== credentials.email.toLowerCase()
            ) {
              return null
            }
            const payload = await getPayload({ config })
            const found = await payload.find({
              collection: 'users',
              where: { email: { equals: credentials.email.toLowerCase() } },
              limit: 1,
              overrideAccess: true,
            })
            if (!found.docs.length) return null
            const u = found.docs[0] as User
            return {
              id: String(u.id),
              email: u.email,
              name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
              payloadUserId: u.id,
            }
          } catch {
            return null
          }
        }

        // Normal credentials path: verify Turnstile then validate password
        const valid = await verifyTurnstile(credentials.turnstileToken)
        if (!valid) throw new Error('Bot verification failed. Please try again.')

        try {
          const payload = await getPayload({ config })
          const result = await payload.login({
            collection: 'users',
            data: { email: credentials.email, password: credentials.password! },
          })
          if (!result.user) return null
          const u = result.user as User
          return {
            id: String(u.id),
            email: u.email,
            name: [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
            payloadUserId: u.id,
          }
        } catch {
          return null
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account, user }) {
      // Block Google sign-in if no email was returned
      if (account?.provider === 'google' && !user.email) return false
      return true
    },

    async jwt({ token, user, account, profile }) {
      if (account && user) {
        if (account.provider === 'credentials') {
          // user.id is the Payload user ID (string of numeric ID), set in authorize()
          token.payloadUserId = user.payloadUserId ?? user.id
        } else if (account.provider === 'google' && user.email) {
          // Find or create the Payload user for this Google account
          try {
            const payload = await getPayload({ config })
            const googleId = account.providerAccountId
            const email = user.email.toLowerCase()
            const firstName = (profile as any)?.given_name as string | undefined
            const lastName = (profile as any)?.family_name as string | undefined
            const avatarUrl = (profile as any)?.picture as string | undefined

            // 1. Match by Google ID
            const byGoogleId = await payload.find({
              collection: 'users',
              where: { googleId: { equals: googleId } },
              limit: 1,
              overrideAccess: true,
            })

            let payloadUser: User

            if (byGoogleId.docs.length > 0) {
              payloadUser = byGoogleId.docs[0] as User
              if (avatarUrl && (payloadUser as any).avatarUrl !== avatarUrl) {
                await payload.update({
                  collection: 'users',
                  id: payloadUser.id,
                  data: { avatarUrl },
                  overrideAccess: true,
                })
              }
            } else {
              // 2. Match by email
              const byEmail = await payload.find({
                collection: 'users',
                where: { email: { equals: email } },
                limit: 1,
                overrideAccess: true,
              })

              if (byEmail.docs.length > 0) {
                payloadUser = await payload.update({
                  collection: 'users',
                  id: byEmail.docs[0].id,
                  data: {
                    googleId,
                    authProvider: 'google',
                    emailVerified: true,
                    ...(firstName && !byEmail.docs[0].firstName ? { firstName } : {}),
                    ...(lastName && !byEmail.docs[0].lastName ? { lastName } : {}),
                    ...(avatarUrl ? { avatarUrl } : {}),
                  },
                  overrideAccess: true,
                }) as User
              } else {
                // 3. Create a new Payload user
                const tempPassword = randomBytes(32).toString('base64') + '!A1a'
                payloadUser = await payload.create({
                  collection: 'users',
                  data: {
                    email,
                    password: tempPassword,
                    firstName: firstName || '',
                    lastName: lastName || '',
                    googleId,
                    authProvider: 'google',
                    emailVerified: true,
                    role: 'customer',
                    ...(avatarUrl ? { avatarUrl } : {}),
                  },
                  overrideAccess: true,
                }) as User
              }
            }

            token.payloadUserId = payloadUser.id
          } catch (err) {
            console.error('[NextAuth] Google jwt error:', err)
          }
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.payloadUserId = token.payloadUserId
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}
