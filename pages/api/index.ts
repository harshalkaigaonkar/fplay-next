// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IndexAPIResponseData } from 'types'

export default function handler(
  _req: NextApiRequest,
  _res: NextApiResponse<IndexAPIResponseData>
) {
  _res.status(200).json({
    type: "API Server for fPlay",
    status: "Success",
   })
}
