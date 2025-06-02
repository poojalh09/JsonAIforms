import * as fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  const formsDirectory = path.join(process.cwd(), 'forms');
  
  try {
    const files = await fs.readdir(formsDirectory);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        id: path.basename(file, '.json')
      }));
  } catch {
    return [];
  }
}

export default async function FormPreview({ params }: { params: { id: Promise<string> } }) {
  const formsDirectory = path.join(process.cwd(), 'forms');
  
  try {
    const formId = await params.id;
    const filePath = path.join(formsDirectory, `${formId}.json`);
    const rawContent = await fs.readFile(filePath, 'utf8');
    const formData = JSON.parse(rawContent) as any;

    // Convert form to PostgreSQL schema
    const generatePostgresSchema = (formData: any) => {
      if (!formData.fields) return '';
      
      const columns = formData.fields.map((field: any) => {
        let columnType = 'TEXT';
        switch (field.type) {
          case 'number':
            columnType = 'INTEGER';
            break;
          case 'email':
            columnType = 'VARCHAR(255)';
            break;
          case 'date':
            columnType = 'DATE';
            break;
          case 'boolean':
            columnType = 'BOOLEAN';
            break;
          default:
            columnType = 'TEXT';
        }
        
        return `  ${field.label.toLowerCase().replace(/\s+/g, '_')} ${columnType}${field.required ? ' NOT NULL' : ''}`;
      });

      return `CREATE TABLE ${formData.title.toLowerCase().replace(/\s+/g, '_')} (
  id SERIAL PRIMARY KEY,
${columns.join(',\n')}
);`;
    };

    const postgresSchema = generatePostgresSchema(formData);

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-xl">
            <CardHeader className="bg-primary/10 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-primary">
                  {formData.title || 'Untitled Form'}
                </CardTitle>
                <Badge variant="outline" className="text-sm">
                  Form Preview
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Form Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Form Fields</h3>
                    {formData.fields && formData.fields.length > 0 ? (
                      <ul className="space-y-2 pl-4 border-l-2 border-primary/20">
                        {formData.fields.map((field: any, index: number) => (
                          <li key={index} className="text-sm">
                            <span className="font-semibold">{field.label || 'Unnamed Field'}</span>
                            {field.type && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {field.type}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No fields defined</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Form Metadata</h3>
                    <div className="space-y-2 bg-secondary/10 p-4 rounded-lg">
                      <div>
                        <span className="font-semibold">Layout:</span>
                        <Badge variant="outline" className="ml-2">
                          {formData.layout || 'Default'}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-semibold">Total Fields:</span>
                        <Badge variant="outline" className="ml-2">
                          {formData.fields ? formData.fields.length : 0}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {formData.description && (
                <section>
                  <h3 className="text-xl font-semibold mb-4 border-b pb-2">Description</h3>
                  <p className="text-muted-foreground italic">
                    {formData.description}
                  </p>
                </section>
              )}

              <section>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">PostgreSQL Schema</h3>
                <pre className="bg-secondary/10 p-4 rounded-lg text-sm overflow-x-auto">
                  {postgresSchema}
                </pre>
              </section>

              <div className="flex justify-between mt-6">
                <Link href="/view-forms">
                  <Button variant="outline">Back to Forms</Button>
                </Link>
                <div className="flex gap-4">
                  <Link href={`/GetStarted?formId=${formId}`}>
                    <Button variant="secondary">Edit Form</Button>
                  </Link>
                  <Link href={`/AITableGenerator?formId=${formId}`}>
                    <Button>Convert to Table</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error reading form:', error);
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <div className="text-center">
          <p className="text-2xl mb-4">Form Not Found</p>
          <Link href="/view-forms">
            <Button>Back to Forms</Button>
          </Link>
        </div>
      </div>
    );
  }
}
