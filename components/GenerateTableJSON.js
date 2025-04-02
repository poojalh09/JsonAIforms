"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Download, Copy, ExternalLink } from "lucide-react";
import DynamicTable from "@/components/DynamicTable";

import { FileJson, Wand2, Sparkles, Table, FormInput } from "lucide-react";

const ColumnInput = ({ index, column, handleChange, handleRemove }) => {
  const handleSelectChange = (value) => {
    handleChange(index, { target: { name: 'type', value } });
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border mb-4">
      <div className="flex-1">
        <Label htmlFor={`name-${index}`} className="sr-only">Column Name</Label>
        <Input
          id={`name-${index}`}
          name="name"
          value={column.name}
          onChange={(e) => handleChange(index, e)}
          placeholder="Column Name"
        />
      </div>
      
      <div className="w-40">
        <Select 
          value={column.type} 
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="int">Integer</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="destructive"
        size="icon"
        onClick={() => handleRemove(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const GenerateJSONForTable = () => {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([]);
  const [tableMetadata, setTableMetadata] = useState({
    title: "New Table"
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [showUrlCard, setShowUrlCard] = useState(false);

  const handleMetadataChange = (field, value) => {
    setTableMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTableDefinition = () => ({
    title: tableMetadata.title || tableName || "Dynamic Table",
    columns: columns.map(column => ({
      name: column.name,
      type: column.type,
    }))
  });

  const handleAddColumn = () => {
    setColumns([...columns, { name: '', type: 'text' }]);
  };

  const handleChange = (index, event) => {
    const newColumns = [...columns];
    newColumns[index][event.target.name] = event.target.value;
    setColumns(newColumns);
  };

  const handleRemove = (index) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
  };

  const copyEmbedCodeToClipboard = () => {
    const embedCode = `<section id="form-section" class="content-section">
    <h2>Fill Out the Survey</h2>
    <p>Your feedback helps us improve the pharmaceutical industry.
       Please fill out the form below:</p>
    <iframe id="formIframe"
        src="${generatedUrl}"
        style="width: 100%; height: 600px; border: none;">
    </iframe>
</section>`;
    navigator.clipboard.writeText(embedCode);
  };

  const handleGenerateJSON = async () => {
    try {
        const tableDefinition = getTableDefinition();
        console.log("Generated Table JSON:", tableDefinition);
        // Upload JSON to API
        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableDefinition })
        });

        if (!uploadResponse.ok) throw new Error("Upload failed");
        const responseData = await uploadResponse.json();
        const id = responseData.id;
        console.log("Table ID:", id);
                
        const iframeUrl = `${window.location.origin}/table/${id}`;
        setGeneratedUrl(iframeUrl);
        setShowUrlCard(true);
    } catch (error) {
        console.error("Error generating table:", error);
        alert("Failed to generate table JSON.");
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* URL Card that appears when table is generated */}
      {showUrlCard && (
        <Card className="mb-6 border-green-500 shadow-lg">
          <CardHeader className="pb-2 bg-green-50">
            <CardTitle className="text-xl text-green-700">Table Generated Successfully! 🚀</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Embeddable URL:</Label>
                <div className="flex mt-1">
                  <Input 
                    value={generatedUrl} 
                    readOnly 
                    className="flex-1 bg-white border-green-200"
                  />
                  <Button onClick={copyToClipboard} className="ml-2" variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                    
                  </Button>
                  <Button 
                    onClick={() => window.open(generatedUrl, '_blank')} 
                    className="ml-2" 
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Embed Code:</Label>
                <div className="mt-1 p-3 bg-white rounded-md border border-green-200">
                  <pre className="text-xs whitespace-pre-wrap break-words">
{`<section id="form-section" class="content-section">
    <h2>Fill Out the Survey</h2>
    <p>Your feedback helps us improve the pharmaceutical industry.
       Please fill out the form below:</p>
    <iframe id="formIframe"
        src="${generatedUrl}"
        style="width: 100%; height: 600px; border: none;">
    </iframe>
</section>`}
                  </pre>
                </div>
                <Button onClick={copyEmbedCodeToClipboard} className="mt-2" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Schema Generator */}
        <div className="space-y-6">
          <Card className="h-full " >
            <CardHeader>
            <div className="flex justify-between items-center">
             <CardTitle className="text-2xl font-bold">Table Editor</CardTitle>
             
             <Button 
                      onClick={handleGenerateJSON} 
                      variant="outline"
                      disabled={columns.length === 0}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Table
                      
                    </Button>
                    </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tableName">Table Name</Label>
                    <Input
                      id="tableName"
                      value={tableName}
                      onChange={(e) => {
                        setTableName(e.target.value);
                        handleMetadataChange('title', e.target.value);
                      }}
                      placeholder="Enter table name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button onClick={handleAddColumn}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Column
                    </Button>
                    
                  </div>
                </div>
                
                <Separator />

                <ScrollArea className="h-[300px] pr-4">
                  {columns.map((column, index) => (
                    <ColumnInput
                      key={index}
                      index={index}
                      column={column}
                      handleChange={handleChange}
                      handleRemove={handleRemove}
                    />
                  ))}
                </ScrollArea>

                {columns.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">JSON Preview</h3>
                      <Card>
                        <CardContent className="p-4 bg-muted">
                          <pre className="text-sm whitespace-pre-wrap break-words">
                            {JSON.stringify({ tableName, columns }, null, 2)}
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

        {/* Right Column - Live Preview  */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px]">
                {columns.length > 0 ? (
                  <DynamicTable tableDefinition={getTableDefinition()} />
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

export default GenerateJSONForTable;

