import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    // Directory where form definitions are stored
    const formsDirectory = path.join(process.cwd(), 'forms');

    try {
        // Ensure forms directory exists
        if (!fs.existsSync(formsDirectory)) {
            fs.mkdirSync(formsDirectory, { recursive: true });
            return NextResponse.json([]);
        }

        // Read all JSON files
        const formFiles = fs.readdirSync(formsDirectory)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(formsDirectory, file);
                try {
                    // Read entire file content
                    const rawContent = fs.readFileSync(filePath, 'utf8');
                    
                    // Try to parse, but return minimal info if parsing fails
                    try {
                        const formData = JSON.parse(rawContent);
                        return {
                            ...formData,
                            id: path.basename(file, '.json')
                        };
                    } catch (parseError) {
                        // If JSON parsing fails, return minimal info
                        return { 
                            id: path.basename(file, '.json'), 
                            rawContent: rawContent 
                        };
                    }
                } catch (readError) {
                    console.error(`Error reading file ${file}:`, readError);
                    return null;
                }
            })
            // Remove any null entries
            .filter(form => form !== null);

        return NextResponse.json(formFiles);

    } catch (error) {
        console.error('Error retrieving forms:', error);
        return NextResponse.json({ 
            error: "Failed to retrieve forms", 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
