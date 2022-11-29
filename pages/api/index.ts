// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Data } from 'types'

export default function handler(
  _req: NextApiRequest,
  _res: NextApiResponse<Data>
) {

  _res.status(200).json({ name: 'John Doe' })
}
