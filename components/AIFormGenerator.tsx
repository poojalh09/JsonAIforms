"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PlusCircle, Copy, Download, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import DynamicForm from "./DynamicForm";
import FormFieldEditor from "./FormFieldEditor";
import { generateFormDefinition } from "@/lib/gemini";

interface FormDefinition {
  title: string;
  layout: string;
  fields: any[];
}

interface CopyState {
  url: boolean;
  code: boolean;
}

const EXAMPLE_PROMPTS = [
  "Create a patient registration form with personal details, medical history, and insurance information",
  "Make a clinical trial enrollment form with consent sections and eligibility questions",
  "Design a medication order form with dosage options and administration instructions",
  "Build a research study participant form with demographic questions and study-specific fields"
];

const AIFormGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [activeTab, setActiveTab] = useState("prompt");
  const [copyState, setCopyState] = useState<CopyState>({ url: false, code: false });
  const [error, setError] = useState<string | null>(null);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate form');
      }

      const data = await response.json();
      setFormDefinition(data);
      setActiveTab("form");
      toast.success("Form generated successfully!");
    } catch (err) {
      setError("Failed to generate form. Please try again.");
      toast.error("Failed to generate form");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (index: number, updatedField: any) => {
    if (!formDefinition) return;

    const updatedFields = [...formDefinition.fields];
    updatedFields[index] = updatedField;

    setFormDefinition({
      ...formDefinition,
      fields: updatedFields,
    });
  };

  const handleAddField = () => {
    if (!formDefinition) return;

    const newField: any = {
      name: `field${formDefinition.fields.length + 1}`,
      label: "New Field",
      type: "text",
      required: false,
    };

    setFormDefinition({
      ...formDefinition,
      fields: [...formDefinition.fields, newField],
    });
  };

  const handleRemoveField = (index: number) => {
    if (!formDefinition) return;

    const updatedFields = formDefinition.fields.filter((_, i) => i !== index);
    setFormDefinition({
      ...formDefinition,
      fields: updatedFields,
    });
  };

  const handleCopyJSON = () => {
    if (!formDefinition) return;

    const jsonString = JSON.stringify(formDefinition, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      toast.success("JSON copied to clipboard");
    }).catch((err) => {
      toast.error("Failed to copy JSON");
      console.error("Copy failed:", err);
    });
  };

  const handleExportJSON = () => {
    if (!formDefinition) return;

    const jsonString = JSON.stringify(formDefinition, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formDefinition.title.replace(/\s+/g, '_').toLowerCase()}_form.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("JSON exported successfully");
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="form">Form Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="prompt">Describe your form requirements</label>
              <Textarea
                id="prompt"
                placeholder="e.g., Create a patient registration form with personal details and medical history"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-32"
              />
              <Button 
                onClick={handlePromptSubmit} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Generate Form
              </Button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="grid gap-2">
              <label>Example prompts</label>
              <ScrollArea className="h-48 rounded-md border p-4">
                <div className="space-y-2">
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setPrompt(examplePrompt)}
                    >
                      {examplePrompt}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="form" className="space-y-4">
          {formDefinition ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">{formDefinition.title}</h3>
                  <DynamicForm formDefinition={formDefinition} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">JSON Definition</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyJSON}
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copy JSON
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleExportJSON}
                      >
                        <Download className="mr-2 h-4 w-4" /> Export JSON
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
                    {JSON.stringify(formDefinition, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit" className="space-y-4">
          {formDefinition ? (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{formDefinition.title}</h3>
                  <Button onClick={handleAddField} variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </div>
                <div className="space-y-4">
                  {formDefinition.fields.map((field, index) => (
                    <FormFieldEditor
                      key={index}
                      field={field}
                      onUpdate={(updatedField) => handleUpdateField(index, updatedField)}
                      onRemove={() => handleRemoveField(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFormGenerator;
