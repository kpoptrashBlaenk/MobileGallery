import dotenv from 'dotenv'
import { Request, Response } from 'express'
import qrcode from 'qrcode'

dotenv.config()

export function qrRoute(req: Request, res: Response) {
  // Generate QR code with secret key
  qrcode.toDataURL(process.env.SECRET_OTPAUTH_URL as string, (error, imageUrl) => {
    if (error) {
      res.status(500).json('Error generating QR code')
      return
    }

    res.status(200).json(imageUrl)
    return
  })
}

export default qrRoute
