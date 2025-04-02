"use server";

import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ViewForms() {
  const formsDirectory = path.join(process.cwd(), 'forms');
  
  let formFiles: any[] = [];
  try {
    // Ensure directory exists
    await fs.mkdir(formsDirectory, { recursive: true });

    // Read directory contents
    const files = await fs.readdir(formsDirectory);
    
    // Filter and parse JSON files
    formFiles = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const filePath = path.join(formsDirectory, file);
          const rawContent = await fs.readFile(filePath, 'utf8');
          const formData = JSON.parse(rawContent);
          
          return {
            ...formData,
            id: path.basename(file, '.json')
          };
        })
    );
  } catch (error) {
    console.error('Error reading forms:', error);
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Generated Forms</h1>
        
        {formFiles.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No forms have been generated yet.</p>
            <Link href="/GetStarted">
              <Button className="mt-4">Create a New Form</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formFiles.map((form, index) => (
              <Card key={form.id || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{form.title || 'Untitled Form'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground mb-2">
                      Fields: {form.fields ? form.fields.length : 'N/A'}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Layout: {form.layout || 'Default'}
                      </p>
                      <Link href={`/form-preview/${form.id}`}>
                        <Button variant="outline" size="sm">View Form</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
