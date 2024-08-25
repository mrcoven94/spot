import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/db'
import natural from 'natural'

const tokenizer = new natural.WordTokenizer()
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn')
const tfidf = new natural.TfIdf()

function extractKeywords(text: string): string[] {
  tfidf.addDocument(text)
  return tfidf.listTerms(0 /*document index*/)
    .slice(0, 10)
    .map(item => item.term)
}

function analyzeSentiment(text: string): string {
  const tokens = tokenizer.tokenize(text)
  const score = sentiment.getSentiment(tokens)
  if (score > 0.1) return 'Positive'
  if (score < -0.1) return 'Negative'
  return 'Neutral'
}

function extractEntities(text: string): string[] {
  const language = "EN"
  const defaultCategory = 'N'
  const lexicon = new natural.Lexicon(language, defaultCategory)
  const ruleSet = new natural.RuleSet('EN')
  const tagger = new natural.BrillPOSTagger(lexicon, ruleSet)
  
  const tokens = tokenizer.tokenize(text)
  const taggedWords = tagger.tag(tokens)
  
  return taggedWords.taggedWords
    .filter(word => word.tag.startsWith('N') || word.tag.startsWith('V'))
    .map(word => word.token)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { content } = req.body

  if (!content) {
    return res.status(400).json({ message: 'Content is required' })
  }

  const keywords = extractKeywords(content)
  const sentimentResult = analyzeSentiment(content)
  const entities = extractEntities(content)
  
  const doc = {
    id: Date.now().toString(),
    name: 'Uploaded Document',
    content,
    keywords,
    sentiment: sentimentResult,
    entities
  }

  db.addDocument(doc)

  res.status(200).json({ 
    documentId: doc.id,
    keywords,
    sentiment: sentimentResult,
    entities
  })
}