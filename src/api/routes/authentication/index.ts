import { TokenBody } from '@/types'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import speakeasy from 'speakeasy'
import { findCookiesByCookies, saveCookies } from './cookies'

dotenv.config()

const router = express.Router()

// Generate QR code
router.get('/qr', async (req: Request, res: Response) => {
  // Generate QR code with secret key
  qrcode.toDataURL(process.env.SECRET_OTPAUTH_URL as string, (error, imageUrl) => {
    if (error) {
      res.status(500).json('Error generating QR code')
      return
    }

    res.status(200).json(imageUrl)
    return
  })
})

// Verify OTP
router.post('/verify', async (req: Request, res: Response) => {
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
})

// Auto Login
router.post('/login', async (req: Request, res: Response) => {
  const cookies = req.cookies?.family as string

  // Check if cookies
  if (!cookies) {
    res.status(401).json('Unauthorized.')
    return
  }

  try {
    // Find cookies
    const session = await findCookiesByCookies(cookies)

    // Check session found
    if (session.rowCount === 0) {
      res.status(401).json('Unauthorized.')
      return
    }

    res.status(200).json('Session found.')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error finding session.')
    return
  }
})

export default router
