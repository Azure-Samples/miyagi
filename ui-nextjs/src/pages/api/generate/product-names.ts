import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const OPENAI_URL = process.env.OPENAI_URL

  const { body, method } = req
  switch (method) {
    case 'POST':
      try {
        const response = await fetch(`${OPENAI_URL}/generate/product-names`, {
          method: 'POST',
          body
        })
        const responseJson = await response.json()
        res.status(200).json(responseJson)
      } catch (e) {
        console.log(e)
        res.status(500).json(e)
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
