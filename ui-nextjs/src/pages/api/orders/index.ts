import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const ACCOUNTING_URL = process.env.ACCOUNTING_URL

  const {
    query: { id, name },
    method
  } = req

  switch (method) {
    case 'GET':
      // Get orders from backend
      const orders = await fetch(`${ACCOUNTING_URL}/orders`)
      const ordersJson = await orders.json()
      res.status(200).json(ordersJson)
      break
    case 'PUT':
      // Update or create data in your database
      // const stats = await fetch(`${ACCOUNTING_URL}/stats`, {
      //   method: 'PUT',
      //   body: JSON.stringify({
      //     id,
      //     name,
      //   }),
      //   }
      // }
      res.status(200).json({ id, name: name || `User ${id}` })
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
