import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const VIRTUAL_CUSTOMERS_URL = process.env.VIRTUAL_CUSTOMERS_URL

  const {
    query: { numOrders },
    method
  } = req

  switch (method) {
    case 'POST':
      // Get orders from backend
      const requestHeaders: HeadersInit = new Headers()
      requestHeaders.set('x-origin', 'nextjs')
      const response = await fetch(`${VIRTUAL_CUSTOMERS_URL}/simulate-orders?numOrders=${numOrders}`, {
        method: 'POST',
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
