import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: 'Search query is required' })
  }

  const results = db.searchDocuments(q)

  res.status(200).json(results)
}