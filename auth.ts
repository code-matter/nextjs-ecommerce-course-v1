import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'
import { compare } from './lib/encrypt'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const config = {
    pages: {
        signIn: '/auth/sign-in',
        error: '/auth/sign-in',
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
                    const isMatch = await compare(
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
            session.user.role = token.role
            session.user.name = token.name

            if (trigger === 'update') {
                session.user.name = user.name
            }
            return session
        },
        async jwt({ token, user, trigger }: any) {
            if (user) {
                token.role = user.role

                if (user.name === 'NO_NAME') {
                    token.name = user.email.split('@')[0]

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    })
                }

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObj = await cookies()
                    const sessionCartId = cookiesObj.get('sessionCartId')?.value

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId },
                        })
                        if (sessionCart) {
                            // await prisma.cart.deleteMany({
                            //     where: { userId: user.id },
                            // })
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id },
                            })
                        }
                    }
                }
            }
            return token
        },
        authorized({ request, auth }: any) {
            if (!request.cookies.get('sessionCartId')) {
                const sessionCartId = crypto.randomUUID()

                const newReqHeaders = new Headers(request.headers)
                const response = NextResponse.next({
                    request: {
                        headers: newReqHeaders,
                    },
                })
                response.cookies.set('sessionCartId', sessionCartId)
                return response
            } else {
                return true
            }
        },
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
