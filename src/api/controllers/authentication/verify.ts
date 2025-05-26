import { saveCookies } from '@/api/models/cookies'
import { TokenBody } from '@/types'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'

dotenv.config()

export async function verifyRoute(req: Request, res: Response) {
  const { token }: TokenBody = req.body

  // Check if token
  if (!token) {
    res.status(422).json('Token is missing.')
    return
  }

  // Check if token is valid
  const verified = speakeasy.totp.verify({
    secret: process.env.SECRET_BASE_32 as string,
    encoding: 'base32',
    token: token,
    window: 1,
  })

  // Failed
  if (!verified) {
    res.status(401).json('OTP verification failed. Please try again.')
    return
  }

  // Create cookies
  const cookies = jwt.sign({ token }, process.env.SECRET_KEY as string, { expiresIn: '30d' })

  res.cookie('family', cookies, {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax', // lax for cross origin
  })

  // Save cookies
  try {
    await saveCookies(cookies)

    res.status(200).json('OTP verified successfully.')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error saving cookies.')
    return
  }
}

export default verifyRoute
