import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const ORDERS_URL = process.env.ORDERS_URL

  const { method } = req

  switch (method) {
    case 'GET':
      // Get orders from backend
      const requestHeaders: HeadersInit = new Headers()
      requestHeaders.set('x-source', 'nextjs')
      const response = await fetch(`${ORDERS_URL}/products`, {
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
