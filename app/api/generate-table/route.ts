// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// // Add dynamic configuration
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// export async function POST(request: NextRequest) {
//   try {
//     // Parse the request body
//     const requestBody = await request.json();
//     const { formId, tableData } = requestBody;

//     if (!formId || !tableData) {
//       return NextResponse.json(
//         { error: 'Form ID and table data are required' }, 
//         { status: 400 }
//       );
//     }

//     // Validate table data structure
//     if (!tableData.columns || !tableData.schema) {
//       return NextResponse.json(
//         { error: 'Invalid table data structure' }, 
//         { status: 400 }
//       );
//     }

//     // Directories for storing generated artifacts
//     const tablesDirectory = path.join(process.cwd(), 'tables');
//     const sqlDirectory = path.join(process.cwd(), 'sql');

//     // Ensure directories exist
//     await fs.mkdir(tablesDirectory, { recursive: true });
//     await fs.mkdir(sqlDirectory, { recursive: true });

//     // Generate unique table name
//     const tableName = (tableData.title || 'generated_table')
//       .toLowerCase()
//       .replace(/[^a-z0-9_]/g, '_');

//     // Prepare table metadata
//     const tableMetadata = {
//       id: formId,
//       name: tableName,
//       title: tableData.title || 'Generated Table',
//       description: tableData.description || '',
//       columns: tableData.columns,
//       createdAt: new Date().toISOString()
//     };

//     // Save table metadata JSON
//     const tableMetadataPath = path.join(tablesDirectory, `${formId}_table_metadata.json`);
//     await fs.writeFile(tableMetadataPath, JSON.stringify(tableMetadata, null, 2));

//     // Save SQL schema
//     const sqlSchemaPath = path.join(sqlDirectory, `${formId}_create_table.sql`);
//     await fs.writeFile(sqlSchemaPath, tableData.schema);

//     // Optional: Generate sample data insert script
//     const sampleDataScript = generateSampleDataScript(tableName, tableData.columns);
//     const sampleDataPath = path.join(sqlDirectory, `${formId}_sample_data.sql`);
//     await fs.writeFile(sampleDataPath, sampleDataScript);

//     return NextResponse.json({
//       success: true,
//       message: 'Table generated successfully',
//       details: {
//         tableMetadataPath,
//         sqlSchemaPath,
//         sampleDataPath
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Table generation error:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to generate table',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }, 
//       { status: 500 }
//     );
//   }
// }

// // Helper function to generate sample data insert script
// function generateSampleDataScript(tableName: string, columns: any[]): string {
//   // Generate sample data based on column types
//   const sampleData = columns.map(col => {
//     switch (col.type.toLowerCase()) {
//       case 'integer':
//         return Math.floor(Math.random() * 1000);
//       case 'varchar':
//       case 'text':
//         return `'Sample ${col.name}'`;
//       case 'boolean':
//         return Math.random() > 0.5;
//       case 'date':
//         return `'${new Date().toISOString().split('T')[0]}'`;
//       default:
//         return `'Sample Value'`;
//     }
//   });

//   // Construct INSERT statement
//   const columnNames = columns.map(col => col.name).join(', ');
//   const values = sampleData.join(', ');

//   return `-- Sample data for ${tableName}
// INSERT INTO ${tableName} (${columnNames})
// VALUES (${values});
// `;
// }

// export async function GET(request: NextRequest) {
//   try {
//     // List all generated tables
//     const tablesDirectory = path.join(process.cwd(), 'tables');
//     const tableFiles = await fs.readdir(tablesDirectory);

//     const tableMetadata = await Promise.all(
//       tableFiles
//         .filter(file => file.endsWith('_table_metadata.json'))
//         .map(async (file) => {
//           const filePath = path.join(tablesDirectory, file);
//           const content = await fs.readFile(filePath, 'utf8');
//           return JSON.parse(content);
//         })
//     );

//     return NextResponse.json({
//       success: true,
//       tables: tableMetadata
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error listing tables:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to list tables',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }, 
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { useCase } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!useCase) {
      return NextResponse.json(
        { error: 'Use case is required' }, 
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a comprehensive JSON table structure for the following use case: ${useCase}. 
    CRITICAL INSTRUCTIONS:
    - Respond ONLY with a valid JSON
    - Use these EXACT keys: title, columns, sampleData
    - Columns MUST have: name, type, description
    - SampleData MUST match column names
    - Provide 3-5 realistic sample rows
    - NO additional text, comments, or code block markers

    JSON SCHEMA:
    {
      "title": "Table Title",
      "columns": [
        {
          "name": "ColumnName1",
          "type": "string|number|date",
          "description": "Column description"
        }
      ],
      "sampleData": [
        {
          "ColumnName1": "Sample Value"
        }
      ]
    }`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { 
            error: 'Failed to extract JSON',
            rawText: text,
            details: 'No valid JSON found in the response'
          }, 
          { status: 400 }
        );
      }

      let parsedJson;
      try {
        // Attempt to parse the extracted JSON
        parsedJson = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        return NextResponse.json(
          { 
            error: 'Invalid JSON structure',
            rawText: text,
            rawJson: jsonMatch[0],
            details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
          }, 
          { status: 400 }
        );
      }

      // Validate the parsed JSON structure
      if (!parsedJson.title || 
          !Array.isArray(parsedJson.columns) || 
          !Array.isArray(parsedJson.sampleData)) {
        return NextResponse.json(
          { 
            error: 'Invalid table structure',
            rawText: text,
            rawJson: JSON.stringify(parsedJson),
            details: 'Missing required keys or incorrect data types'
          }, 
          { status: 400 }
        );
      }

      return NextResponse.json(parsedJson);

    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      return NextResponse.json(
        { 
          error: 'Failed to generate table',
          details: apiError instanceof Error ? apiError.message : 'Unknown API error'
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
