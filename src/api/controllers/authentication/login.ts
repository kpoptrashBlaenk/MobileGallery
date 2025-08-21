import { sessionExist } from '@/utils/apiFunctions'
import { Request, Response } from 'express'

async function loginRoute(req: Request, res: Response) {
  const cookies = req.cookies?.family as string

  const valid = await sessionExist(cookies)

  if (valid) {
    res.status(200).json('Session found.')
    return
  } else {
    res.status(401).json('Unauthorized.')
    return
  }
}

export default loginRoute
