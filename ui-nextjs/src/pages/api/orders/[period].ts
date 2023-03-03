import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const ACCOUNTING_URL = process.env.ACCOUNTING_URL

  const {
    query: { period },
    method
  } = req

  switch (method) {
    case 'GET':
      // Get orders from backend
      const chartKv = await fetch(`${ACCOUNTING_URL}/orders/${period}`)
      const chartKvJson = await chartKv.json()
      res.status(200).json(chartKvJson)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
