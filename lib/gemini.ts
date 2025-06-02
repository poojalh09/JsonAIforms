import { GoogleGenAI } from "@google/genai";
import { jsonRepair } from "./jsonRepair";

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

interface FormDefinition {
  title: string;
  layout: string;
  fields: any[];
}

export async function generateFormDefinition(prompt: string): Promise<FormDefinition> {
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

    return generateFormDefinitionFromCleanedText(cleanedText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export async function generateFormDefinitionFromCleanedText(cleanedText: string): Promise<FormDefinition> {
  try {
    let formDefinition: FormDefinition;
    
    // More aggressive JSON cleaning and repair
    const cleanJson = (text: string) => {
      // Use the new jsonRepair utility to fix broken escape sequences in regex patterns
      return jsonRepair(text);
    };

    try {
      // First, attempt to parse the original text
      formDefinition = JSON.parse(cleanedText) as FormDefinition;
    } catch (parseError) {
      console.error('Initial JSON Parsing Error:', parseError);
      
      // Apply cleaning and repair
      const cleanedJson = cleanJson(cleanedText);
      
      try {
        formDefinition = JSON.parse(cleanedJson) as FormDefinition;
      } catch (repairError) {
        console.error('JSON Repair Error:', repairError);
        console.error('Original Response:', cleanedText);
        console.error('Cleaned Response:', cleanedJson);
        
        // If repair fails, attempt to manually reconstruct or provide a fallback
        throw new Error(`Failed to parse Gemini API response. Unable to clean JSON. Original error: ${repairError instanceof Error ? repairError.message : 'Unknown parsing error'}`);
      }
    }

    // Validate and normalize the form definition
    if (!formDefinition || !formDefinition.fields || !Array.isArray(formDefinition.fields)) {
      throw new Error('Invalid form definition: missing or invalid fields');
    }

    // Process each field to ensure validation and set default values
    formDefinition.fields = formDefinition.fields.map((field) => {
      // Ensure basic field properties
      if (!field.label || !field.type) {
        throw new Error(`Invalid field: missing label or type - ${JSON.stringify(field)}`);
      }

      // Set default options if not provided
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        field.options = [];
      }

      // Set default validation if not provided
      field.validation = field.validation || {
        required: field.required || false
      };

      return field;
    });

    return formDefinition;
  } catch (error) {
    console.error('Form Definition Generation Error:', error);
    throw error;
  }
}
