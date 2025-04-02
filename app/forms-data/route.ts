import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
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
                    const rawContent = fs.readFileSync(filePath, 'utf8');
                    const formData = JSON.parse(rawContent);
                    
                    return {
                        ...formData,
                        id: path.basename(file, '.json')
                    };
                } catch {
                    return null;
                }
            })
            .filter(form => form !== null);

        return NextResponse.json(formFiles, { status: 200 });

    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
