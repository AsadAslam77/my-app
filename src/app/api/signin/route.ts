import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import userModel from '@/model/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        usernmae:{ label:'username',type:'text'}
      },
      async authorize(credentials) {
        await dbConnect()
        const user = await userModel.findOne({ email: credentials?.email })
        if (!user) throw new Error('Email is not vailid')
            // console.log(user)

        const match = await bcrypt.compare(credentials!.password, user.password)
        if (!match) throw new Error('password is not valid')
       else
        return { id: user.id.toString(), email: user.email ,Username:user.username}
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/Dashboard' },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) token.user = user
//       return token
//     },
//     async session({ session, token }) {
//       session.user = token.user as any
//       return session
//     }
//   }
}
