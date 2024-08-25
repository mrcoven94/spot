import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const uploadDir = path.join(process.cwd(), 'uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  })

  try {
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const fileField = files.file
    if (!fileField || Array.isArray(fileField)) {
      throw new Error('No file uploaded or multiple files received')
    }

    const file = fileField as formidable.File
    const data = fs.readFileSync(file.filepath, 'utf8')

    // Analyze the document
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const analyzeResponse = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data }),
    })

    if (!analyzeResponse.ok) {
      throw new Error('Analysis failed')
    }

    const analysisResult = await analyzeResponse.json()

    res.status(200).json({ 
      message: 'File uploaded and analyzed successfully', 
      content: data,
      keywords: analysisResult.keywords,
      documentId: analysisResult.documentId
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Error uploading file' })
  }
}