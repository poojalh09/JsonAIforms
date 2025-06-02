"use client";

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  Save,
  PlusCircle,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define a more flexible type for table definition
interface TableDefinition {
  title: string;
  columns: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  sampleData: Array<{
    [key: string]: string | number | boolean;
  }>;
}

const EXAMPLE_PROMPTS = [
  "Create a patient medical record tracking table",
  "Generate a clinical trial participant management table",
  "Design a pharmaceutical inventory management table",
  "Build a research study sample tracking table"
];

export default function AITableGenerator() {
  const [useCase, setUseCase] = useState('');
  const [tableDefinition, setTableDefinition] = useState<TableDefinition | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Editing states
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<{[key: string]: string | number | boolean}>({});

  const handleGenerateTable = async () => {
    if (!useCase.trim()) {
      toast.error("Please enter a use case for the table");
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setErrorDetails(null);
      setTableDefinition(null);

      const response = await fetch('/api/generate-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useCase })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Table Generation Error:', responseData);
        
        const errorMessage = responseData.details || responseData.error || 'Failed to generate table';
        
        // Store detailed error for potential debugging
        if (responseData.rawText) {
          setErrorDetails(`Raw Text: ${responseData.rawText}`);
        }
        if (responseData.rawJson) {
          setErrorDetails(prev => 
            prev 
              ? `${prev}\n\nRaw JSON: ${JSON.stringify(responseData.rawJson, null, 2)}` 
              : `Raw JSON: ${JSON.stringify(responseData.rawJson, null, 2)}`
          );
        }
        
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Validate the table definition
      const generatedTable = responseData;
      if (!generatedTable.title || !generatedTable.columns || !generatedTable.sampleData) {
        toast.error("Received invalid table structure");
        setErrorDetails(`Received data: ${JSON.stringify(generatedTable, null, 2)}`);
        return;
      }

      console.log('Generated Table:', generatedTable);
      setTableDefinition(generatedTable);
      toast.success("Table generated successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      console.error('Unexpected Table Generation Error:', errorMessage);
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableDefinition 
    ? tableDefinition.sampleData.slice(indexOfFirstRow, indexOfLastRow)
    : [];

  const pageNumbers = tableDefinition 
    ? Array.from(
        { length: Math.ceil(tableDefinition.sampleData.length / rowsPerPage) }, 
        (_, i) => i + 1
      )
    : [];

  // Row editing functions
  const handleEditRow = (rowIndex: number) => {
    const globalIndex = (currentPage - 1) * rowsPerPage + rowIndex;
    setEditingRow(rowIndex);
    if (tableDefinition) {
      setEditedRow(tableDefinition.sampleData[globalIndex]);
    }
  };

  const handleSaveRow = () => {
    if (!tableDefinition) return;

    const globalIndex = (currentPage - 1) * rowsPerPage + (editingRow ?? 0);
    const updatedSampleData = [...tableDefinition.sampleData];
    updatedSampleData[globalIndex] = editedRow;

    setTableDefinition({
      ...tableDefinition,
      sampleData: updatedSampleData
    });

    setEditingRow(null);
    toast.success("Row updated successfully!");
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!tableDefinition) return;

    const globalIndex = (currentPage - 1) * rowsPerPage + rowIndex;
    const updatedSampleData = tableDefinition.sampleData.filter((_, index) => index !== globalIndex);

    setTableDefinition({
      ...tableDefinition,
      sampleData: updatedSampleData
    });

    toast.success("Row deleted successfully!");
  };

  // Export and copy functions
  const handleCopyTableDefinition = () => {
    if (!tableDefinition) return;
    
    navigator.clipboard.writeText(JSON.stringify(tableDefinition, null, 2));
    toast.success("Table definition copied to clipboard!");
  };

  const handleExportTableDefinition = () => {
    if (!tableDefinition) return;

    const jsonString = JSON.stringify(tableDefinition, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${tableDefinition.title.replace(/\s+/g, '_')}_table.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    toast.success("Table definition exported!");
  };

  const handleUseExamplePrompt = (prompt: string) => {
    setUseCase(prompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Table Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Table Use Case</Label>
                <Textarea 
                  placeholder="Describe the use case for your table" 
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUseExamplePrompt(prompt)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Example {index + 1}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={handleGenerateTable} 
                disabled={isGenerating}
                variant="destructive"
              >
                {isGenerating ? 'Generating...' : 'Generate Table'}
                <Wand2 className="ml-2 h-4 w-4" />
              </Button>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              )}

              {errorDetails && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
                  <h4 className="font-semibold text-red-700 mb-2">Debugging Information</h4>
                  <pre className="text-xs text-red-600 overflow-x-auto">{errorDetails}</pre>
                </div>
              )}

              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Table Preview</TabsTrigger>
                  <TabsTrigger value="json">JSON Definition</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  {tableDefinition && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{tableDefinition.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-100">
                                {tableDefinition.columns.map((col, index) => (
                                  <th 
                                    key={index} 
                                    className="border border-gray-300 px-4 py-2 text-left"
                                    title={col.description}
                                  >
                                    {col.name} 
                                    <span className="text-xs text-gray-500 block">({col.type})</span>
                                  </th>
                                ))}
                                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                  {tableDefinition.columns.map((col, colIndex) => (
                                    <td 
                                      key={colIndex} 
                                      className="border border-gray-300 px-4 py-2"
                                    >
                                      {editingRow === rowIndex ? (
                                        <Input
                                          value={String(editedRow[col.name] ?? row[col.name])}
                                          onChange={(e) => setEditedRow(prev => ({
                                            ...prev,
                                            [col.name]: e.target.value
                                          }))}
                                        />
                                      ) : (
                                        row[col.name] !== undefined 
                                          ? String(row[col.name]) 
                                          : 'N/A'
                                      )}
                                    </td>
                                  ))}
                                  <td className="border border-gray-300 px-4 py-2">
                                    {editingRow === rowIndex ? (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleSaveRow}
                                      >
                                        <Save className="mr-2 h-4 w-4" /> Save
                                      </Button>
                                    ) : (
                                      <div className="flex space-x-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleEditRow(rowIndex)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          size="sm" 
                                          onClick={() => handleDeleteRow(rowIndex)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-2">
                            <Label>Rows per page:</Label>
                            <Input 
                              type="number" 
                              min="1" 
                              max="20" 
                              value={rowsPerPage} 
                              onChange={(e) => setRowsPerPage(Number(e.target.value))}
                              className="w-20"
                            />
                          </div>
                          <div className="flex space-x-2">
                            {pageNumbers.map(number => (
                              <Button
                                key={number}
                                variant={currentPage === number ? "default" : "outline"}
                                onClick={() => setCurrentPage(number)}
                              >
                                {number}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="json">
                  <ScrollArea className="h-[600px] rounded-md border">
                    <pre className="p-4 font-mono text-sm">
                      {tableDefinition 
                        ? JSON.stringify(tableDefinition, null, 2) 
                        : "No table generated yet"}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              {tableDefinition && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCopyTableDefinition}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Table Definition
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportTableDefinition}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}