"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FormField } from "@/types/forms";

interface DynamicFormProps {
  formDefinition: {
    title: string;
    layout: string;
    fields: FormField[];
  };
}

interface FormDataState {
  [key: string]: string | number | boolean | string[];
}

interface TagFieldsState {
  [key: string]: string[];
}

export default function DynamicForm({ formDefinition }: DynamicFormProps) {
  const [formData, setFormData] = useState<FormDataState>({});
  const [tagFields, setTagFields] = useState<TagFieldsState>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!formDefinition || !formDefinition.fields) {
    return <div>No form definition available</div>;
  }

  const validateField = (field: FormField, value: any): string | null => {
    const validation = typeof field.validation === 'object' ? field.validation : {};

    if (validation.required && !value) {
      return `${field.label} is required`;
    }

    if (validation.pattern && value) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return `Invalid ${field.label} format`;
      }
    }

    const stringValue = String(value || '');

    if (validation.min !== undefined && stringValue.length < validation.min) {
      return `${field.label} must be at least ${validation.min} characters`;
    }

    if (validation.max !== undefined && stringValue.length > validation.max) {
      return `${field.label} must be no more than ${validation.max} characters`;
    }

    if (validation.minLength !== undefined && stringValue.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength !== undefined && stringValue.length > validation.maxLength) {
      return `${field.label} must be no more than ${validation.maxLength} characters`;
    }

    return null;
  };

  const handleInputChange = (name: string, value: string | number | boolean | string[]) => {
    const field = formDefinition.fields.find(f => f.name === name);
    const error = field ? validateField(field, value) : null;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, fieldName: string) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && target.value.trim() !== "") {
      const newTags = [...(tagFields[fieldName] || []), target.value.trim()];
      
      setTagFields(prev => ({
        ...prev,
        [fieldName]: newTags
      }));

      handleInputChange(fieldName, newTags);
      target.value = '';
    }
  };

  const removeTag = (fieldName: string, tagToRemove: string) => {
    setTagFields(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter(tag => tag !== tagToRemove)
    }));

    handleInputChange(fieldName, tagFields[fieldName].filter(tag => tag !== tagToRemove));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="mb-4">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type="text"
              placeholder={field.placeholder}
              value={value as string || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.name} className="mb-4">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={value as string || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div key={field.name} className="mb-4">
            <Label>{field.label}</Label>
            <Select 
              onValueChange={(selectedValue) => handleInputChange(field.name, selectedValue)}
              value={value as string}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'radio':
        return (
          <div key={field.name} className="mb-4">
            <Label>{field.label}</Label>
            <RadioGroup 
              onValueChange={(value) => handleInputChange(field.name, value)}
              value={value as string}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                  <Label htmlFor={`${field.name}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={field.name} className="mb-4 flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleInputChange(field.name, !!checked)}
            />
            <Label htmlFor={field.name}>{field.label}</Label>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'switch':
        return (
          <div key={field.name} className="mb-4 flex items-center space-x-2">
            <Switch
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleInputChange(field.name, !!checked)}
            />
            <Label htmlFor={field.name}>{field.label}</Label>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      
      case 'tags':
        return (
          <div key={field.name} className="mb-4">
            <Label>{field.label}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tagFields[field.name]?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center">
                  {tag}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(field.name, tag)} 
                  />
                </Badge>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Add tag and press Enter"
              onKeyDown={(e) => handleTagInput(e, field.name)}
            />
          </div>
        );
      
      default:
        return <div key={field.name}>Unsupported field type: {field.type}</div>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};

    formDefinition.fields.forEach(field => {
      const fieldError = validateField(field, formData[field.name]);
      if (fieldError) {
        newErrors[field.name] = fieldError;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Add your form submission logic here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{formDefinition.title}</h2>
      {formDefinition.fields.map(renderField)}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}