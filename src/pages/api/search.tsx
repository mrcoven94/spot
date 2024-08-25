import type { NextApiRequest, NextApiResponse } from 'next'

type SearchResult = {
  id: string
  title: string
  summary: string
  relevance: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult[]>
) {
  // This is a mock search function. In a real application, you'd query a database or external API.
  const mockResults: SearchResult[] = [
    { id: '1', title: 'Document A', summary: 'This document discusses AI integration in enterprise software.', relevance: 0.95 },
    { id: '2', title: 'Conversation B', summary: 'A team discussion about implementing RAG in our search feature.', relevance: 0.88 },
    { id: '3', title: 'Process C', summary: 'Workflow for updating the knowledge graph with new information.', relevance: 0.82 },
  ]

  res.status(200).json(mockResults)
}