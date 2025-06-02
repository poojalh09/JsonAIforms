// jsonRepair: Aggressively repair malformed JSON, especially broken escape sequences in regex patterns
export function jsonRepair(badJson: string): string {
  let text = badJson;
  // Remove markdown code blocks if present
  text = text.replace(/```(json)?[\s\n]*([\s\S]*?)```/, '$2');
  // Trim and extract only the JSON object
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    text = text.slice(jsonStart, jsonEnd + 1);
  }
  // Remove newlines and tabs
  text = text.replace(/\t/g, ' ').replace(/\n/g, ' ');
  // Remove trailing commas
  text = text.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
  // Remove leading commas
  text = text.replace(/{\s*,/g, '{').replace(/\[\s*,/g, '[');
  // Fix all single backslashes inside quoted values to double backslashes
  text = text.replace(/("(?:[^"\\]|\\.)*")/g, (m) => {
    // Only operate on string values
    return m.replace(/\\(?![\\"])/g, '\\\\');
  });
  // Remove any remaining bad single backslashes not part of escape sequences
  text = text.replace(/([^\\])\\([\w])/g, '$1$2');
  return text.trim();
}
