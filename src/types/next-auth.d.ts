import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    payloadUserId?: number | string
  }
  interface Session {
    user: {
      payloadUserId?: number | string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    payloadUserId?: number | string
  }
}
