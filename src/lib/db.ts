interface Document {
    id: string;
    name: string;
    content: string;
    keywords: string[];
  }
  
  class InMemoryDB {
    private documents: Document[] = [];
  
    addDocument(doc: Document) {
      this.documents.push(doc);
    }
  
    getAllDocuments(): Document[] {
      return this.documents;
    }
  
    searchDocuments(query: string): Document[] {
      return this.documents.filter(doc => 
        doc.content.toLowerCase().includes(query.toLowerCase()) ||
        doc.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }
  
  export const db = new InMemoryDB();