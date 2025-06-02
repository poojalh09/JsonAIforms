import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple type mapping
const TYPE_MAP: { [key: string]: string } = {
  'text': 'TEXT',
  'number': 'INTEGER',
  'email': 'VARCHAR(255)',
  'date': 'DATE',
  'boolean': 'BOOLEAN',
  'default': 'VARCHAR(255)'
};

// Utility function for safe JSON parsing
function safeJSONParse(content: string): any {
  const cleanContent = content
    .replace(/^\s*\/\/.*$/gm, '')  // Remove line comments
    .replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, '')  // Remove block comments
    .trim();

  try {
    return JSON.parse(cleanContent);
  } catch (jsonError) {
    // Try alternative parsing strategies
    try {
      // Remove newlines and extra spaces
      return JSON.parse(cleanContent.replace(/\s+/g, ' '));
    } catch (altError) {
      // Last resort: attempt to fix common JSON issues
      try {
        // Replace single quotes with double quotes
        const fixedContent = cleanContent
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":');
        return JSON.parse(fixedContent);
      } catch (finalError) {
        throw new Error(`Unable to parse JSON: ${finalError instanceof Error ? finalError.message : String(finalError)}`);
      }
    }
  }
}

// Utility function to extract fields from various locations
function extractFields(data: any): any[] {
  const fieldLocations = [
    data.fields,
    data.form?.fields,
    data.data?.fields,
    data.formFields,
    // Try to find an array of objects with name or label
    Object.values(data).find(v => 
      Array.isArray(v) && 
      v.some(f => f.name || f.label)
    )
  ];

  // Find the first non-empty array of fields
  for (const fields of fieldLocations) {
    if (Array.isArray(fields) && fields.length > 0) {
      return fields;
    }
  }

  return [];
}

export async function GET(request: NextRequest) {
  // Extract form ID from request
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('formId');

  if (!formId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Form ID is required' 
    }, { status: 400 });
  }

  try {
    // Comprehensive file search and reading
    const formsDir = path.join(process.cwd(), 'forms');
    const formFiles = await fs.readdir(formsDir);
    
    // Find all files that might match the form ID
    const matchingFiles = formFiles.filter(file => 
      file.includes(formId) && 
      (file.endsWith('.json') || file.startsWith(formId))
    );

    if (matchingFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No matching form files found',
        details: { 
          formId, 
          availableFiles: formFiles 
        }
      }, { status: 404 });
    }

    // Try parsing each matching file
    for (const matchingFile of matchingFiles) {
      const filePath = path.join(formsDir, matchingFile);
      
      try {
        // Read file content
        const rawContent = await fs.readFile(filePath, 'utf8');
        
        let formData;
        try {
          formData = safeJSONParse(rawContent);
        } catch (parseError) {
          // Log parsing error but continue to next file
          console.error(`Parsing error in ${matchingFile}:`, parseError);
          continue;
        }

        // Extract fields
        const fields = extractFields(formData);

        // Skip if no fields found
        if (fields.length === 0) {
          console.warn(`No fields found in ${matchingFile}`);
          continue;
        }

        // Convert fields to table columns
        const columns = fields.map((field: any, index: number) => ({
          name: (field.name || `column_${index + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '_'),
          label: field.label || `Column ${index + 1}`,
          type: TYPE_MAP[field.type?.toLowerCase()] || TYPE_MAP['default'],
          required: field.required || false
        }));

        // Generate PostgreSQL schema
        const tableName = (formData.title || 'converted_table')
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_');

        const schema = `CREATE TABLE ${tableName} (
  id SERIAL PRIMARY KEY,
${columns.map(col => `  ${col.name} ${col.type} ${col.required ? 'NOT NULL' : ''}`).join(',\n')}
);`;

        // Prepare table data
        const tableData = {
          id: formId,
          title: formData.title || 'Converted Table',
          description: formData.description || '',
          columns,
          schema
        };

        // Save table data
        const tablesDir = path.join(process.cwd(), 'tables');
        await fs.mkdir(tablesDir, { recursive: true });
        const tableFilePath = path.join(tablesDir, `${formId}_table.json`);
        await fs.writeFile(tableFilePath, JSON.stringify(tableData, null, 2));

        return NextResponse.json({ 
          success: true, 
          data: tableData 
        });

      } catch (fileError) {
        console.error(`Error processing ${matchingFile}:`, fileError);
      }
    }

    // If no file could be processed
    return NextResponse.json({
      success: false,
      error: 'Could not convert any form to table',
      details: { 
        formId, 
        matchingFiles: matchingFiles,
        formsDir 
      }
    }, { status: 500 });

  } catch (error) {
    console.error('Unexpected conversion error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Unexpected error during form conversion',
      details: { 
        formId, 
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
