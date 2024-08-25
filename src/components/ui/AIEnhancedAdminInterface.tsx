import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Upload, MessageSquare, Brain, Lightbulb } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

interface AnalysisResult {
  keywords: string[];
  documentId: string;
  sentiment: string;
  entities: string[];
}

export default function AIEnhancedAdminInterface(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleSearch = async () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploadStatus('Uploading...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setUploadStatus('File uploaded and analyzed successfully')
      setAnalysisResult(result)
      toast.success('File uploaded and analyzed successfully')
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadStatus('Error uploading file')
      toast.error('Error uploading file')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster />
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-4">AI Admin Panel</h2>
        <nav>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <MessageSquare className="mr-2 h-4 w-4" /> Conversations
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Brain className="mr-2 h-4 w-4" /> AI Insights
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Lightbulb className="mr-2 h-4 w-4" /> Coaching
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col">
        <Tabs defaultValue="upload" className="flex-1">
          <TabsList>
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="search">Search & Insights</TabsTrigger>
          </TabsList>
          
          {/* Upload & Analyze Tab */}
          <TabsContent value="upload" className="flex-1">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Upload & Analyze Documents</CardTitle>
                <CardDescription>Upload documents for AI analysis and integration into the knowledge base.</CardDescription>
              </CardHeader>
              <CardContent>
                <Input type="file" onChange={handleFileUpload} className="mb-4" />
                {uploadStatus && <p className="mb-4">{uploadStatus}</p>}
                {analysisResult && (
                  <div>
                    <h3 className="font-semibold mb-2">Analysis Results:</h3>
                    <p>Document ID: {analysisResult.documentId}</p>
                    <p>Keywords: {analysisResult.keywords.join(', ')}</p>
                    <p>Sentiment: {analysisResult.sentiment}</p>
                    <p>Entities: {analysisResult.entities.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Search & Insights Tab */}
          <TabsContent value="search" className="flex-1">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>AI-Powered Search & Insights</CardTitle>
                <CardDescription>Search across all documents and conversations with AI assistance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="mr-2 h-4 w-4" /> Search
                  </Button>
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <h3 className="font-semibold mb-2">AI-Enhanced Search Results</h3>
                  <p>AI-powered search results and summaries will appear here...</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}