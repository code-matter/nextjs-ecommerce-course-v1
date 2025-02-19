import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'

export const config = {
    pages: {
        signIn: '/auth/sign-in',
        // signOut: '/auth/signout',
        error: '/auth/sign-in', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            authorize: async credentials => {
                if (credentials === null) return null
                const user = await prisma.user.findFirst({
                    where: { email: credentials.email as string },
                })
                if (user && user.password) {
                    const isMatch = compareSync(
                        credentials.password as string,
                        user.password,
                    )
                    if (isMatch)
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        }
                }
                return null
            },
        }),
    ],
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //   return true
        // },
        // async redirect({ url, baseUrl }) {
        //   return baseUrl
        // },
        async session({ session, user, trigger, token }: any) {
            session.user.id = token.sub
            if (trigger === 'update') {
                session.user.name = user.name
            }
            return session
        },
        // async jwt({ token, user, account, profile, isNewUser }) {
        //   return token
        // }
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
