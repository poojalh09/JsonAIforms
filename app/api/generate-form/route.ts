import { NextResponse } from 'next/server';
import { generateFormDefinition } from '@/lib/gemini';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid form description' },
        { status: 400 }
      );
    }

    // Generate form definition
    const formDefinition = await generateFormDefinition(prompt.trim());

    // Generate a unique ID for the form
    const formId = crypto.randomBytes(16).toString('hex');

    // Save form to file
    const formsDirectory = path.join(process.cwd(), 'forms');
    
    // Ensure forms directory exists
    if (!fs.existsSync(formsDirectory)) {
      fs.mkdirSync(formsDirectory, { recursive: true });
    }

    // Prepare form data with additional metadata
    const formData = {
      ...formDefinition,
      id: formId,
      prompt: prompt.trim(),
      createdAt: new Date().toISOString()
    };

    // Write form definition to a JSON file
    const filePath = path.join(formsDirectory, `${formId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(formData, null, 2));

    return NextResponse.json(formData, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
