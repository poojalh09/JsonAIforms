"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/types/forms";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export interface FormFieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onRemove: () => void;
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "password", label: "Password" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "switch", label: "Switch" },
  { value: "slider", label: "Slider" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Date Time" },
  { value: "tags", label: "Tags" }
];

const FIELD_POSITIONS = [
  { value: "col-span-1", label: "Normal width" },
  { value: "col-span-2", label: "Double width" },
  { value: "col-span-3", label: "Triple width" },
  { value: "col-span-full", label: "Full width" },
];

const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
  field,
  onUpdate,
  onRemove,
}) => {
  const handleChange = (key: keyof FormField, value: any) => {
    onUpdate({
      ...field,
      [key]: value
    });
  };

  const handleOptionsChange = (value: string) => {
    const options = value.split(",").map(opt => opt.trim()).filter(opt => opt !== "");
    handleChange("options", options);
  };

  const getValidationString = (validation: FormField['validation']): string => {
    if (!validation) return '';
    if (typeof validation === 'string') return validation;
    return JSON.stringify(validation);
  };

  const handleValidationChange = (value: string) => {
    try {
      // Try to parse as JSON first
      const jsonValidation = JSON.parse(value);
      handleChange("validation", jsonValidation);
    } catch {
      // If not valid JSON, treat as string
      handleChange("validation", value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ delay: 0.05 }}
    >
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="px-2 py-0 text-xs">
              Field
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 -mt-2 -mr-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select
                value={field.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Field Position</Label>
              <Select
                value={field.position || "col-span-1"}
                onValueChange={(value) => handleChange("position", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select field position" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_POSITIONS.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="details">
              <AccordionTrigger>Field Details</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`field-name`}>Name</Label>
                  <Input
                    id={`field-name`}
                    value={field.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter field name..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`field-label`}>Label</Label>
                  <Input
                    id={`field-label`}
                    value={field.label}
                    onChange={(e) => handleChange("label", e.target.value)}
                    placeholder="Enter field label..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`field-placeholder`}>Placeholder</Label>
                  <Input
                    id={`field-placeholder`}
                    value={field.placeholder || ""}
                    onChange={(e) => handleChange("placeholder", e.target.value)}
                    placeholder="Enter placeholder text..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`field-validation`}>Validation</Label>
                  <Input
                    id={`field-validation`}
                    value={getValidationString(field.validation)}
                    onChange={(e) => handleValidationChange(e.target.value)}
                    placeholder="Enter validation pattern..."
                  />
                </div>

                {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                  <div className="space-y-2">
                    <Label htmlFor={`field-options`}>Options</Label>
                    <Input
                      id={`field-options`}
                      value={field.options?.join(", ") || ""}
                      onChange={(e) => handleOptionsChange(e.target.value)}
                      placeholder="Enter options separated by commas..."
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`field-required`}
                    checked={field.required || false}
                    onCheckedChange={(checked) => handleChange("required", checked)}
                  />
                  <Label htmlFor={`field-required`}>Required</Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FormFieldEditor;
