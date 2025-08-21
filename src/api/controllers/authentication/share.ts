import { saveShareToken } from '@/api/models/share'
import { IdBody } from '@/types'
import { Request, Response } from 'express'

export async function shareRoute(req: Request, res: Response) {
  const id: IdBody = req.body

  if (!id) {
    res.status(422).json('No media provided.')
    return
  }

  const token = crypto.randomUUID()

  try {
    await saveShareToken(id.id, token)

    res.status(200).json(`localhost:5173/media/${token}`)
    return
  } catch (error) {
    console.error(error)
    res.status(200).json('Share token creation failed.')
    return
  }
}
