import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const USER_SERVICE_URL = process.env.USER_SERVICE_URL

  const {
    method
  } = req

  switch (method) {
    case 'GET':
      // Get fake user profiles from backend
      const requestHeaders: HeadersInit = new Headers()
      requestHeaders.set('x-origin', 'nextjs')
      const response = await fetch(`${USER_SERVICE_URL}/api/v1/userprofile/generate`, {
        method: 'GET',
        headers: requestHeaders
      })
      const responseJson = await response.json()
      res.status(200).json(responseJson)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
