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

  if (!formDefinition) {
    return null;
  }

  const handleInputChange = (name: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      target.value = "";
    }
  };

  const removeTag = (index: number, fieldName: string) => {
    const newTags = tagFields[fieldName].filter((_, i) => i !== index);
    setTagFields(prev => ({
      ...prev,
      [fieldName]: newTags
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, tagFields });
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={String(formData[field.name] || "")}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={String(formData[field.name] || "")}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "select":
        return (
          <Select
            value={String(formData[field.name] || "")}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            value={String(formData[field.name] || "")}
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={String(option)} id={`${field.name}-${index}`} />
                <Label htmlFor={`${field.name}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        const selectedValues = (formData[field.name] || []) as string[];
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${index}`}
                  checked={selectedValues.includes(String(option))}
                  onCheckedChange={(checked) => {
                    const currentValues = [...selectedValues];
                    if (checked) {
                      currentValues.push(String(option));
                    } else {
                      const optionIndex = currentValues.indexOf(String(option));
                      if (optionIndex > -1) {
                        currentValues.splice(optionIndex, 1);
                      }
                    }
                    handleInputChange(field.name, currentValues);
                  }}
                />
                <Label htmlFor={`${field.name}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "switch":
        return (
          <Switch
            checked={Boolean(formData[field.name])}
            onCheckedChange={(checked) => handleInputChange(field.name, checked)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${formDefinition.layout === "horizontal" ? "grid grid-cols-2 gap-4" : ""}`}>
      {formDefinition.fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          {field.description && (
            <p className="text-sm text-gray-500">{field.description}</p>
          )}
          {renderField(field)}
        </div>
      ))}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}