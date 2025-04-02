import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to clean the response text
function cleanJsonResponse(text: string): string {
  try {
    // Remove markdown code blocks
    const codeBlockRegex = /```(json)?[\s\n]*([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    
    if (match) {
      text = match[2] || match[0];
    }

    // Trim and remove any text before or after JSON
    text = text.trim();
    
    // Find the first and last occurrence of { and }
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    // Remove any leading/trailing whitespace
    return text.trim();
  } catch (error) {
    console.error('Error cleaning JSON response:', error);
    return text;
  }
}

export async function generateFormDefinition(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [{
          text: `You are a form generation assistant. I need you to create a form definition based on my requirements.
          
IMPORTANT INSTRUCTIONS:
- Respond ONLY with a valid JSON object
- NO additional text or markdown
- Strictly follow this JSON structure:

{
  "title": "Form Title",
  "layout": "vertical",
  "fields": [
    {
      "name": "fieldName",
      "label": "Field Label",
      "type": "text|textarea|select|radio|checkbox|switch|slider|tags",
      "placeholder": "Optional placeholder",
      "required": true|false,
      "options": ["option1", "option2"],
      "validation": {
        "required": true|false,
        "pattern": "optional regex",
        "min": "optional min value",
        "max": "optional max value"
      }
    }
  ]
}

RULES:
1. Use camelCase for field names
2. Choose appropriate field types
3. Add meaningful validation
4. Include helpful placeholders

Create a form for this use case: ${prompt}`
        }]
      }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Get the full text response
    const fullText = response.text || '';
    console.log('Full Gemini Response:', fullText);

    // Clean the response text
    const cleanedText = cleanJsonResponse(fullText);
    console.log('Cleaned Response Text:', cleanedText);

    try {
      // Attempt to parse the cleaned response as JSON
      const formDefinition = JSON.parse(cleanedText);
      
      // Validate the structure
      if (!formDefinition.title || !formDefinition.layout || !Array.isArray(formDefinition.fields)) {
        throw new Error("Invalid form definition structure");
      }
      
      // Process and validate fields
      formDefinition.fields.forEach((field: any) => {
        if (!field.name || !field.label || !field.type) {
          throw new Error("Invalid field definition");
        }
        
        // Ensure camelCase field names
        field.name = field.name
          .replace(/[^a-zA-Z0-9]+(.)/g, (m: string, chr: string) => chr.toUpperCase())
          .replace(/^[A-Z]/, (firstChar: string) => firstChar.toLowerCase());
        
        // Default options for select/radio/checkbox
        if (["select", "radio", "checkbox"].includes(field.type)) {
          field.options = field.options || [];
        }

        // Ensure validation object
        field.validation = field.validation || {
          required: field.required || false
        };
      });
      
      return formDefinition;
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      console.error('Failed Response Text:', cleanedText);
      
      throw new Error(`Invalid response format from Gemini: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
