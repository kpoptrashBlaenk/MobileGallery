
import { sessionExist } from '@/utils/apiFunctions'
import { NextFunction, Request, Response } from 'express'

async function guestOnly(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies?.family as string

  const valid = await sessionExist(cookies)

  if (!valid) {
    next()
    return
  } else {
    res.status(401).json('Unauthorized.')
    return
  }
}

export default guestOnly
