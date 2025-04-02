"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Download, Trash2, PlusCircle, Wand2, Copy, CheckCircle2, ExternalLink } from "lucide-react";

import DynamicForm from "@/components/DynamicForm";

import DynamicFormPage from './DynamicFormPage';

import Page from '@/app/form/[id]/page';

const ColumnInput = ({ index, column, handleChange, handleRemove, handleOptionChange, handleAddOption, handleRemoveOption, handleRequiredChange }) => {
  const handleSelectChange = (value, fieldName) => {
    handleChange(index, { target: { name: fieldName, value } });
  };

  return (
    <Card className="mb-6 mt-2 relative group">
      <CardContent className="pt-6">
        <div className="absolute -top-3 left-4 bg-background px-2">
          <Badge variant="outline">Field {index + 1}</Badge>
        </div>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Field Name</Label>
              <Input
                id={`name-${index}`}
                name="name"
                value={column.name}
                onChange={(e) => handleChange(index, e)}
                placeholder="Enter field name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select 
                value={column.type} 
                onValueChange={(value) => handleSelectChange(value, 'type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="tags">Tags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label>Column Span</Label>
              <Select
                value={column.position}
                onValueChange={(value) => handleSelectChange(value, 'position')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column span" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="col-span-1">Single Column</SelectItem>
                  <SelectItem value="col-span-2">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id={`required-${index}`}
                checked={column.required}
                onCheckedChange={() => handleRequiredChange(index)}
              />
              <Label htmlFor={`required-${index}`}>Required Field</Label>
            </div>
          </div>

          {column.type === 'slider' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lower Bound</Label>
                <Input
                  type="number"
                  name="lowerBound"
                  value={column.lowerBound || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Upper Bound</Label>
                <Input
                  type="number"
                  name="upperBound"
                  value={column.upperBound || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="100"
                />
              </div>
            </div>
          )}

          {(column.type === 'radio' || column.type === 'checkbox' || column.type === 'select') && (
            <div className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Options</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(index)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {column.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, optIndex, e)}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveOption(index, optIndex)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="destructive"
          size="icon"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const GenerateJSONForForm = () => {
  const [columns, setColumns] = useState([]);
  const [formMetadata, setFormMetadata] = useState({
    title: "New Form",
    layout: "grid-cols-2 gap-4"
  });
  const [formUrl, setFormUrl] = useState(null);
  const [isCopied, setIsCopied] = useState({
    url: false,
    embedCode: false
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMetadataChange = (field, value) => {
    setFormMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFormDefinition = () => ({
    title: formMetadata.title,
    layout: formMetadata.layout,
    fields: columns.map(column => ({
      name: column.name,
      type: column.type,
      label: column.name,
      required: column.required,
      options: column.options,
      position: column.position,
      ...(column.type === 'slider' && {
        lowerBound: column.lowerBound,
        upperBound: column.upperBound,
      })
    }))
  });

  const handleCopyUrlToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
    setIsCopied(prev => ({ ...prev, url: true }));
    toast({
      title: "URL copied to clipboard!",
      description: "You can now paste the URL where needed."
    });
    
    setTimeout(() => {
      setIsCopied(prev => ({ ...prev, url: false }));
    }, 3000);
  };

  const handleCopyEmbedCodeToClipboard = () => {
    const embedCode = `<section id="form-section" class="content-section">
    <h2>Fill Out the Survey</h2>
    <p>Your feedback helps us improve the pharmaceutical industry.
       Please fill out the form below:</p>
    <iframe id="formIframe"
        src="${formUrl}"
        style="width: 100%; height: 600px; border: none;">
    </iframe>
</section>`;

    navigator.clipboard.writeText(embedCode);
    setIsCopied(prev => ({ ...prev, embedCode: true }));
    toast({
      title: "Embed code copied to clipboard!",
      description: "You can now paste the embed code into your HTML."
    });
    
    setTimeout(() => {
      setIsCopied(prev => ({ ...prev, embedCode: false }));
    }, 3000);
  };

  const handleGenerateJSON = async () => {
    try {
        setIsGenerating(true);
        const formDefinition = getFormDefinition();
        console.log("Generated Form JSON:", formDefinition);
        // Upload JSON to API
        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formDefinition })
        });

        if (!uploadResponse.ok) throw new Error("Upload failed");
        const responseData = await uploadResponse.json();
        const id = responseData.id;
        console.log("Form ID:", id);
                
        const iframeUrl = `${window.location.origin}/form/${id}`;
        setFormUrl(iframeUrl);
        
        toast({
          title: "Form Generated Successfully!",
          description: "Your form is now ready to be embedded.",
        });
    } catch (error) {
        console.error("Error generating form:", error);
        toast({
          title: "Error",
          description: "Failed to generate form JSON.",
          variant: "destructive",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAddColumn = () => {
    setColumns([...columns, { 
      name: '', 
      type: 'text', 
      options: [], 
      required: false, 
      position: 'col-span-1'
    }]);
    toast({
      title: "Field Added",
      description: "A new field has been added to your form.",
    });
  };

  const handleChange = (index, event) => {
    const newColumns = [...columns];
    newColumns[index][event.target.name] = event.target.value;
    setColumns(newColumns);
  };

  const handleRequiredChange = (index) => {
    const newColumns = [...columns];
    newColumns[index].required = !newColumns[index].required;
    setColumns(newColumns);
  };

  const handleRemove = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
    toast({
      title: "Field Removed",
      description: "The field has been removed from your form.",
      variant: "destructive",
    });
  };

  const handleOptionChange = (colIndex, optIndex, event) => {
    const newColumns = [...columns];
    newColumns[colIndex].options[optIndex] = event.target.value;
    setColumns(newColumns);
  };

  const handleAddOption = (index) => {
    const newColumns = [...columns];
    newColumns[index].options.push('');
    setColumns(newColumns);
  };

  const handleRemoveOption = (colIndex, optIndex) => {
    const newColumns = [...columns];
    newColumns[colIndex].options.splice(optIndex, 1);
    setColumns(newColumns);
  };

  return (
    <div className="container mx-auto py-8">
      {formUrl && (
        <Card className="mb-8 border-green-300 shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-xl font-bold text-green-700">Your Form is Ready! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="iframeUrl">Form URL</Label>
                <div className="flex">
                  <Input
                    id="iframeUrl"
                    value={formUrl}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={handleCopyUrlToClipboard}
                    title="Copy URL only"
                  >
                    {isCopied.url ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    onClick={() => window.open(formUrl, '_blank')} 
                    className="ml-2" 
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200 ">
                <h3 className="text-sm font-medium mb-2">HTML Embed Code:</h3>
                <pre className="text-xs overflow-auto p-2 bg-white rounded border border-gray-200">
{`<section id="form-section" class="content-section">
    <h2>Fill Out the Survey</h2>
    <p>Your feedback helps us improve the pharmaceutical industry.
       Please fill out the form below:</p>
    <iframe id="formIframe"
        src="${formUrl}"
        style="width: 100%; height: 600px; border: none;">
    </iframe>
</section>`}
                </pre>
                <Button
                    className="ml-2 mt-4"
                    onClick={handleCopyEmbedCodeToClipboard}
                  >
                    {isCopied.embedCode ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Embed Code
                      </>
                    )}
                  </Button>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>The form will be embedded at the location where you paste this snippet.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Editor Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Form Editor</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={handleGenerateJSON}
                  disabled={columns.length === 0 || isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Form
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Form Metadata Section */}
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="formTitle">Form Title</Label>
                        <Input
                          id="formTitle"
                          value={formMetadata.title}
                          onChange={(e) => handleMetadataChange('title', e.target.value)}
                          placeholder="Enter form title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="formLayout">Form Layout</Label>
                        <Select
                          value={formMetadata.layout}
                          onValueChange={(value) => handleMetadataChange('layout', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select layout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid-cols-1 gap-4">Single Column</SelectItem>
                            <SelectItem value="grid-cols-2 gap-4">Two Columns</SelectItem>
                            <SelectItem value="grid-cols-3 gap-4">Three Columns</SelectItem>
                            <SelectItem value="grid-cols-4 gap-4">Four Columns</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <Button 
                  onClick={handleAddColumn}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Field
                </Button>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {columns.map((column, index) => (
                    <ColumnInput
                      key={index}
                      index={index}
                      column={column}
                      handleChange={handleChange}
                      handleRemove={handleRemove}
                      handleOptionChange={handleOptionChange}
                      handleAddOption={handleAddOption}
                      handleRemoveOption={handleRemoveOption}
                      handleRequiredChange={handleRequiredChange}
                    />
                  ))}
                </div>

                {columns.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">JSON Preview</h3>
                      <Card>
                        <CardContent className="p-4">
                          <pre className="text-sm overflow-auto max-h-[200px] bg-muted p-4 rounded-lg">
                            {JSON.stringify(getFormDefinition(), null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <div className="min-h-[200px]">
                {columns.length > 0 ? (
                  <DynamicForm formDefinition={getFormDefinition()} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
                    <p className="text-center text-muted-foreground">
                      Add fields in the editor to see your form preview here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateJSONForForm;