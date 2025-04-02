import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    // Directory where form definitions are stored
    const formsDirectory = path.join(process.cwd(), 'forms');

    try {
        // Ensure forms directory exists
        if (!fs.existsSync(formsDirectory)) {
            fs.mkdirSync(formsDirectory, { recursive: true });
            return NextResponse.json([], { status: 200 });
        }

        // Read all JSON files
        const formFiles = fs.readdirSync(formsDirectory)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(formsDirectory, file);
                try {
                    // Read entire file content
                    const rawContent = fs.readFileSync(filePath, 'utf8');
                    const formData = JSON.parse(rawContent);
                    
                    return {
                        ...formData,
                        id: path.basename(file, '.json')
                    };
                } catch (error) {
                    console.error(`Error processing form file ${file}:`, error);
                    return null;
                }
            })
            .filter(form => form !== null);

        return NextResponse.json(formFiles, { status: 200 });

    } catch (error) {
        console.error('Error retrieving forms:', error);
        return NextResponse.json({ 
            error: "Failed to retrieve forms", 
            details: error.message 
        }, { status: 500 });
    }
}