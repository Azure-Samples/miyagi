import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function embeddingsHandler(req: NextApiRequest, res: NextApiResponse) {

  const { body, method } = req
  switch (method) {
    case 'POST':
      // Store user embeddings in vector database
      const requestHeaders: HeadersInit = new Headers()
      requestHeaders.set('x-source', 'nextjs')
      requestHeaders.set('Content-Type', 'application/json')
      requestHeaders.set('charset', 'utf8')
      console.log('body', body)
      const response = await fetch(`${process.env.MEMORY_SERVICE_URL}/user`, {
        method: 'POST',
        body,
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
