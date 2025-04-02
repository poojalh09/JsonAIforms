"use client";

import { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Plus, ChevronUp, ChevronDown, Search, Database } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function DynamicTable({ tableDefinition }) {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);

  useEffect(() => {
    // Initialize newRow with empty values based on table definition
    if (tableDefinition && tableDefinition.columns) {
      const initialRow = {};
      tableDefinition.columns.forEach(col => {
        initialRow[col.name] = col.type === 'boolean' ? false : '';
      });
      setNewRow(initialRow);
    }
  }, [tableDefinition]);

  // Function to populate data from dummyData.json
  const populateFromDummy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/dummyData.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData.records || []);
    } catch (error) {
      console.error('Error loading dummy data:', error);
      alert('Failed to load dummy data. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Search and sort data
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply search filter
    if (searchQuery) {
      processedData = processedData.filter((row) =>
        Object.entries(row).some(([key, value]) => {
          if (key === "id") return false;
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (sortConfig.direction === "asc") {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });
    }

    return processedData;
  }, [data, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Row selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(paginatedData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (checked, rowId) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, rowId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== rowId));
    }
  };

  const deleteRows = (ids) => {
    setData(prev => prev.filter(row => !ids.includes(row.id)));
    setSelectedRows(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleBulkDelete = () => {
    deleteRows(selectedRows);
  };

  // Handle field changes for new row
  const handleNewRowChange = (name, value) => {
    setNewRow(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new row
  const handleAddRow = () => {
    const validationErrors = {};
    let hasErrors = false;

    // Basic validation     -4-
    tableDefinition.columns.forEach(col => {
      if (col.type === 'int' && newRow[col.name] && isNaN(parseInt(newRow[col.name]))) {
        validationErrors[col.name] = 'Must be a valid number';
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }

    // Create new row with unique ID
    const newId = Math.max(0, ...data.map(row => row.id || 0)) + 1;
    const rowToAdd = {
      id: newId,
      ...newRow
    };

    setData(prev => [...prev, rowToAdd]);
    
    // Reset form
    const initialRow = {};
    tableDefinition.columns.forEach(col => {
      initialRow[col.name] = col.type === 'boolean' ? false : '';
    });
    setNewRow(initialRow);
    setErrors({});
    setShowAddRow(false);
  };

  if (!tableDefinition || !tableDefinition.columns) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">No table definition available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{tableDefinition.title || "Dynamic Table"}</CardTitle>
          <div className="flex gap-4 items-center">
            
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            {selectedRows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Delete Selected ({selectedRows.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Rows</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedRows.length} selected rows? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button onClick={() => setShowAddRow(!showAddRow)} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showAddRow && (
          <Card className="mb-4 border border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Add New Row</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tableDefinition.columns.map((col) => (
                  <div key={`new-${col.name}`} className="flex flex-col space-y-2">
                    <Label htmlFor={`new-${col.name}`}>{col.name}</Label>
                    {col.type === 'boolean' ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`new-${col.name}`}
                          checked={!!newRow[col.name]}
                          onCheckedChange={(checked) => handleNewRowChange(col.name, checked)}
                        />
                        <Label htmlFor={`new-${col.name}`}>
                          {newRow[col.name] ? "Yes" : "No"}
                        </Label>
                      </div>
                    ) : col.type === 'date' ? (
                      <Input
                        id={`new-${col.name}`}
                        type="date"
                        value={newRow[col.name] ? new Date(newRow[col.name]).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleNewRowChange(col.name, e.target.value)}
                        className={errors[col.name] ? "border-red-500" : ""}
                      />
                    ) : (
                      <Input
                        id={`new-${col.name}`}
                        type={col.type === 'int' ? 'number' : 'text'}
                        value={newRow[col.name] || ''}
                        onChange={(e) => handleNewRowChange(col.name, e.target.value)}
                        placeholder={`Enter ${col.name}`}
                        className={errors[col.name] ? "border-red-500" : ""}
                      />
                    )}
                    {errors[col.name] && (
                      <p className="text-xs text-red-500">{errors[col.name]}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddRow(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRow}>
                  Add Record
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <Checkbox
                      checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  {tableDefinition.columns.map((col, index) => (
                    <th 
                      key={`header-${col.name}-${index}`}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(col.name)}
                    >
                      <div className="flex items-center gap-2">
                        {col.name}
                        {sortConfig.key === col.name && (
                          sortConfig.direction === "asc" ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? paginatedData.map((row) => (
                  <tr key={`row-${row.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(checked, row.id)}
                      />
                    </td>
                    {tableDefinition.columns.map((col, colIndex) => (
                      <td key={`cell-${row.id}-${col.name}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                        {col.type === "date" && row[col.name]
                          ? formatDate(row[col.name])
                          : col.type === "boolean"
                          ? row[col.name] ? "✓" : "✗"
                          : row[col.name] || "-"}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Row</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this row? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteRows([row.id])} className="bg-red-500 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={tableDefinition.columns.length + 2} className="px-6 py-10 text-center text-gray-500">
                      {isLoading ? (
                        <p>Loading data...</p>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="mb-4">No data available</p>
                          <Button 
                            onClick={populateFromDummy} 
                            variant="outline" 
                            className="flex items-center gap-2"
                          >
                            <Database className="h-4 w-4" />
                            Populate with Sample Data
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {paginatedData.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Rows per page
              </p>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}