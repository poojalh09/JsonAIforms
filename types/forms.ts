export interface FormField {
  id?: string;
  name: string;
  label: string;
  type: string;
  position?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: string | {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  defaultValue?: string | number | boolean;
  description?: string;
}
