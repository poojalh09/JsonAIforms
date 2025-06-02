// import React, { useState, useEffect } from 'react';
// import { Copy, CheckCircle2, ExternalLink, Wand2, Plus, Minus, Download, Trash2, PlusCircle } from 'lucide-react';
// import { useTableSuggestions } from '@/hooks/useTableSuggestions';
// import { TableData, TableRow, DataType, CopyState } from '@/types/table';

// const AITableGenerator = () => {
//   // Table data state
//   const [data, setData] = useState<TableData>([]);
//   const [pageSize, setPageSize] = useState<number>(10);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const { useCase, setUseCase, suggestions, setSuggestions, handleSuggestionClick } = useTableSuggestions();
//   const [error, setError] = useState<string>('');
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [showJson, setShowJson] = useState<boolean>(false);

//   // Editing state
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [editedData, setEditedData] = useState<TableData>([]);
//   const [columnNames, setColumnNames] = useState<string[]>(['ID', 'Name', 'Category', 'Price', 'In Stock', 'Date']);
//   const [dataTypes, setDataTypes] = useState<DataType[]>(['number', 'text', 'text', 'number', 'checkbox', 'date']);
  
//   // API key state
//   const [apiKey, setApiKey] = useState<string>('');
//   const [isApiKeySaved, setIsApiKeySaved] = useState<boolean>(false);
  
//   // Sharing state
//   const [tableUrl, setTableUrl] = useState<string | null>(null);
//   const [isCopied, setIsCopied] = useState<CopyState>({
//     url: false,
//     embedCode: false,
//     json: false
//   });

//   // Initialize with sample data
//   useEffect(() => {
//     const sampleData = getSampleData();
//     setData(sampleData);
//     setEditedData(sampleData);
//   }, []);

//   function getSampleData(): TableData {
//     return Array.from({ length: 20 }, (_, index) => ({
//       ID: index + 1,
//       Name: `Item ${index + 1}`,
//       Category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
//       Price: Math.floor(Math.random() * 90) + 10,
//       "In Stock": Math.random() < 0.5,
//       Date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
//     }));
//   }

//   const handleSaveApiKey = () => {
//     if (apiKey.trim()) {
//       setIsApiKeySaved(true);
//       showAlert("API key saved successfully!", "success");
//     } else {
//       showAlert("Please enter a valid API key", "error");
//     }
//   };

//   const handleAddRow = () => {
//     const newRow: TableRow = {
//       ID: data.length + 1,
//       Name: 'New Item',
//       Category: 'A',
//       Price: 0,
//       "In Stock": true,
//       Date: new Date().toLocaleDateString()
//     };
    
//     const newData = [...data, newRow];
//     setData(newData);
//     setEditedData(newData);
//     showAlert("Row added successfully!", "success");
//   };

//   const handleDeleteRows = (selectedIds: number[]) => {
//     const newData = data.filter(item => !selectedIds.includes(item.ID));
//     setData(newData);
//     showAlert("Selected rows deleted!", "success");
//   };

//   const handleGetSuggestions = () => {
//     const exampleSuggestions = 
// `1. Create a product inventory table with columns for ID, Name, Category, Price, In Stock, and Date.
// 2. Create a customer feedback table with columns for Customer ID, Name, Feedback, Rating, and Date.
// 3. Create an order history table with columns for Order ID, Customer Name, Product, Quantity, Price, and Order Date.`;
//     setSuggestions(exampleSuggestions);
//     setError('');
//   };

//   const handleGenerateTable = () => {
//     if (!useCase.trim()) {
//       setError("Please provide a use case description.");
//       return;
//     }

//     setIsGenerating(true);
    
//     // Simulate API call delay
//     setTimeout(() => {
//       const newData = generateTableFromUseCase(useCase);
      
//       if (newData.length > 0) {
//         const firstRow = newData[0];
//         const newColumnNames = Object.keys(firstRow);
//         const newDataTypes = newColumnNames.map(col => {
//           const value = firstRow[col];
//           if (typeof value === 'number') return 'number';
//           if (typeof value === 'boolean') return 'boolean';
//           if (value instanceof Date) return 'date';
//           return 'text';
//         });
        
//         setColumnNames(newColumnNames);
//         setDataTypes(newDataTypes);
//       }
      
//       setData(newData);
//       setEditedData(newData);
//       setIsGenerating(false);
//       setSuggestions('');
      
//       const mockId = Math.random().toString(36).substring(2, 15);
//       setTableUrl(`https://ai-table-generator.example.com/tables/${mockId}`);
      
//       showAlert("Table generated successfully!", "success");
//     }, 1500);
//   };

//   const generateTableFromUseCase = (useCase: string): TableData => {
//     let generatedData: TableData = [];
//     const lowerCaseUseCase = useCase.toLowerCase();
    
//     if (lowerCaseUseCase.includes('product') || lowerCaseUseCase.includes('inventory')) {
//       generatedData = Array.from({ length: 10 }, (_, index) => ({
//         ID: index + 1,
//         Name: `Product ${index + 1}`,
//         Category: ['Electronics', 'Clothing', 'Food', 'Books'][Math.floor(Math.random() * 4)],
//         Price: Math.floor(Math.random() * 900) + 100,
//         "In Stock": Math.random() < 0.7,
//         "Last Updated": new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
//       })) as TableData;
//     } else if (lowerCaseUseCase.includes('customer') || lowerCaseUseCase.includes('feedback')) {
//       generatedData = Array.from({ length: 10 }, (_, index) => ({
//         ID: index + 1,
//         "Customer ID": index + 1001,
//         Name: `Customer ${index + 1}`,
//         Email: `customer${index + 1}@example.com`,
//         Feedback: ['Excellent', 'Good', 'Average', 'Poor'][Math.floor(Math.random() * 4)],
//         Rating: Math.floor(Math.random() * 5) + 1,
//         Date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
//       })) as TableData;
//     } else if (lowerCaseUseCase.includes('order') || lowerCaseUseCase.includes('sales')) {
//       generatedData = Array.from({ length: 10 }, (_, index) => ({
//         ID: index + 1,
//         "Order ID": `ORD${(index + 1).toString().padStart(4, '0')}`,
//         Customer: `Customer ${index + 1}`,
//         Product: `Product ${Math.floor(Math.random() * 5) + 1}`,
//         Quantity: Math.floor(Math.random() * 10) + 1,
//         Price: Math.floor(Math.random() * 500) + 50,
//         "Order Date": new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
//         Status: ['Pending', 'Processing', 'Shipped', 'Delivered'][Math.floor(Math.random() * 4)]
//       })) as TableData;
//     } else {
//       generatedData = Array.from({ length: 10 }, (_, index) => ({
//         ID: index + 1,
//         Name: `Item ${index + 1}`,
//         Description: `Description for item ${index + 1}`,
//         Value: Math.floor(Math.random() * 1000),
//         Status: Math.random() < 0.5,
//         CreatedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
//       })) as TableData;
//     }
    
//     return generatedData;
//   };

//   const formatValue = (value: any, type: DataType): string => {
//     if (value === null || value === undefined) return '';
//     if (type === 'date' && value instanceof Date) return value.toLocaleDateString();
//     if (type === 'checkbox') return value ? '✓' : '✗';
//     return String(value);
//   };

//   const handleEditTable = () => {
//     setIsEditing(true);
//     setEditedData([...data]);
//   };

//   const handleSaveChanges = () => {
//     // Validate data before saving
//     const isValid = validateData(editedData);
//     if (!isValid) {
//       showAlert("Please ensure all data is valid before saving.", "error");
//       return;
//     }
//     setData([...editedData]);
//     setIsEditing(false);
//     showAlert("Changes saved successfully!", "success");
//   };

//   const validateData = (data: TableData): boolean => {
//     for (const row of data) {
//       for (let i = 0; i < columnNames.length; i++) {
//         const colName = columnNames[i];
//         const type = dataTypes[i];
//         const value = row[colName];

//         if (value === undefined || value === null) {
//           showAlert(`Missing value for ${colName}`, "error");
//           return false;
//         }

//         if (type === 'email' && typeof value === 'string' && !isValidEmail(value)) {
//           showAlert(`Invalid email format in column ${colName}`, "error");
//           return false;
//         }

//         if (type === 'number' && typeof value !== 'number') {
//           showAlert(`Invalid number in column ${colName}`, "error");
//           return false;
//         }

//         if (type === 'checkbox' && typeof value !== 'boolean') {
//           showAlert(`Invalid boolean value in column ${colName}`, "error");
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const isValidEmail = (email: string): boolean => {
//     const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
//     return emailRegex.test(email);
//   };

//   const handleChange = (index: number, field: string, value: string | number | boolean) => {
//     const newData = [...editedData];
//     newData[index] = { ...newData[index], [field]: value };
//     setEditedData(newData);
//   };

//   const handleColumnNameChange = (index: number, value: string) => {
//     const oldName = columnNames[index];
//     const newColumnNames = [...columnNames];
//     newColumnNames[index] = value;
//     setColumnNames(newColumnNames);
    
//     const newData = editedData.map(row => {
//       const { [oldName]: oldValue, ...rest } = row;
//       return { ...rest, [value]: oldValue, ID: row.ID };
//     }) as TableData;
    
//     setEditedData(newData);
//   };

//   const handleDataTypeChange = (index: number, value: DataType) => {
//     const newDataTypes = [...dataTypes];
//     newDataTypes[index] = value;
//     setDataTypes(newDataTypes);
    
//     const columnName = columnNames[index];
//     const newData = editedData.map(row => {
//       const newRow = { ...row };
//       if (columnName in newRow) {
//         if (value === 'number') {
//           newRow[columnName] = Number(newRow[columnName]) || 0;
//         } else if (value === 'boolean') {
//           newRow[columnName] = Boolean(newRow[columnName]);
//         } else if (value === 'date') {
//           newRow[columnName] = new Date().toLocaleDateString();
//         } else if (value === 'time') {
//           newRow[columnName] = new Date().toLocaleTimeString();
//         } else {
//           newRow[columnName] = String(newRow[columnName]);
//         }
//       }
//       return newRow;
//     });
    
//     setEditedData(newData);
//   };

//   const handleAddColumn = () => {
//     const newColumnName = `Column ${columnNames.length + 1}`;
//     setColumnNames([...columnNames, newColumnName]);
//     setDataTypes([...dataTypes, 'text']);
    
//     const newData = editedData.map(row => {
//       return { ...row, [newColumnName]: '' };
//     });
    
//     setEditedData(newData);
//     showAlert("Column added successfully!", "success");
//   };

//   const handleRemoveColumn = (index: number) => {
//     const columnToRemove = columnNames[index];
//     const newData = editedData.map(row => {
//       const newRow = { ...row };
//       delete newRow[columnToRemove];
//       return newRow;
//     });
    
//     const newColumnNames = columnNames.filter((_, i) => i !== index);
//     const newDataTypes = dataTypes.filter((_, i) => i !== index);
    
//     setColumnNames(newColumnNames);
//     setDataTypes(newDataTypes);
//     setEditedData(newData);
//     showAlert("Column removed successfully!", "success");
//   };

//   const handleCopyToClipboard = (text: string, type: string) => {
//     navigator.clipboard.writeText(text);
    
//     const newIsCopied = { ...isCopied };
//     newIsCopied[type] = true;
//     setIsCopied(newIsCopied);
    
//     showAlert(`${type === 'url' ? 'URL' : type === 'embedCode' ? 'Embed code' : 'JSON'} copied to clipboard!`, "success");
    
//     setTimeout(() => {
//       const resetIsCopied = { ...isCopied };
//       resetIsCopied[type] = false;
//       setIsCopied(resetIsCopied);
//     }, 3000);
//   };

//   const handleExportJSON = () => {
//     const jsonString = JSON.stringify(data, null, 2);
//     const blob = new Blob([jsonString], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
    
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'table-data.json';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
    
//     URL.revokeObjectURL(url);
//     showAlert("JSON exported successfully!", "success");
//   };

//   const getEmbedCode = (): string => {
//     return `<div id="ai-table-container" style="width: 100%; max-width: 1200px; margin: 0 auto;">
//   <h2>Generated AI Table</h2>
//   <iframe 
//     src="${tableUrl}" 
//     width="100%" 
//     height="600" 
//     frameborder="0"
//     allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" 
//     allowfullscreen
//   ></iframe>
//   <p><small>Powered by AI Table Generator</small></p>
// </div>`;
//   };

//   const showAlert = (message: string, type: string = "info") => {
//     alert(message);
//   };

//   // Pagination logic
//   const paginatedData = isEditing 
//     ? editedData.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
//     : data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
//   const totalPages = Math.ceil((isEditing ? editedData.length : data.length) / pageSize);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">AI Table Generator</h1>
//       <p className="mb-4">Create dynamic tables using AI - just describe what you need</p>

//       {/* API Key Section */}
//       <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
//         <h2 className="text-lg font-semibold">OpenAI API Key</h2>
//         <div className="flex items-center mb-2">
//           <input
//             type="password"
//             placeholder="Enter your API key"
//             className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//           />
//           <button 
//             className="bg-red-500 text-white rounded-lg px-4 py-2"
//             onClick={handleSaveApiKey}
//           >
//             {isApiKeySaved ? "Update Key" : "Save Key"}
//           </button>
//         </div>
//         {isApiKeySaved && (
//           <p className="text-sm text-green-600">✓ API key saved</p>
//         )}
//       </div>

//       {/* Table URL Section (shown after generation) */}
//       {tableUrl && (
//         <div className="mb-6 p-4 border border-green-300 rounded-lg bg-green-50">
//           <h2 className="text-lg font-semibold text-green-700">Your Table is Ready! 🎉</h2>
//           <div className="mt-4 space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Table URL</label>
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={tableUrl}
//                   readOnly
//                   className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 bg-gray-50"
//                 />
//                 <button
//                   onClick={() => handleCopyToClipboard(tableUrl, 'url')}
//                   className="bg-gray-200 text-black rounded-lg px-3 py-2 mr-2"
//                   title="Copy URL"
//                 >
//                   {isCopied.url ? <CheckCircle2 size={18} /> : <Copy size={18} />}
//                 </button>
//                 <button
//                   onClick={() => window.open(tableUrl, '_blank')}
//                   className="bg-blue-500 text-white rounded-lg px-3 py-2"
//                   title="Open in new tab"
//                 >
//                   <ExternalLink size={18} />
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Embed Code</label>
//               <div className="bg-white p-3 border border-gray-200 rounded-lg mt-1">
//                 {getEmbedCode()}
//               </div>
//               <button
//                 onClick={() => handleCopyToClipboard(getEmbedCode(), 'embedCode')}
//                 className="mt-2 bg-gray-200 text-black rounded-lg px-3 py-2 flex items-center"
//               >
//                 {isCopied.embedCode ? <CheckCircle2 size={18} className="mr-1" /> : <Copy size={18} className="mr-1" />}
//                 Copy Embed Code
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Use Case Description */}
//       <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
//         <h2 className="text-lg font-semibold">Describe Your Table</h2>
//         <textarea
//           value={useCase}
//           onChange={(e) => setUseCase(e.target.value)}
//           placeholder="Enter Use Case Description (e.g., 'Create a product inventory table with price and stock information')"
//           className="w-full min-h-[100px] border border-gray-300 rounded-lg p-2 mb-2"
//         />
//         <div className="flex">
//           <button 
//             onClick={handleGetSuggestions} 
//             className="bg-red-500 text-white rounded-lg px-4 py-2 mr-2"
//           >
//             Show Examples
//           </button>
//           <button 
//             onClick={handleGenerateTable} 
//             className="bg-red-500 text-white rounded-lg px-4 py-2 flex items-center"
//             disabled={isGenerating || !useCase.trim()}
//           >
//             {isGenerating ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <Wand2 size={18} />
//                 Generate Table
//               </>
//             )}
//           </button>
//         </div>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
        
//         {suggestions && (
//           <div className="mt-4">
//             <h3 className="font-semibold">Examples:</h3>
//             <div className="bg-white p-3 border border-gray-200 rounded-lg mt-1">
//               {suggestions.split('\n').map((suggestion, index) => (
//                 <div key={index} className="mb-2">
//                   <button 
//                     onClick={() => handleSuggestionClick(suggestion.replace(/^\d+\.\s+/, ''))} 
//                     className="bg-gray-100 hover:bg-gray-200 text-left px-3 py-2 rounded-lg w-full"
//                   >
//                     {suggestion}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Column Configuration */}
//       <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
//         <h2 className="text-lg font-semibold">Edit Column Names and Data Types</h2>
//         <div className="mt-2 overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Column Name</th>
//                 <th className="px-4 py-2 text-left">Data Type</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {columnNames.map((name, index) => (
//                 <tr key={index} className="border-t border-gray-200">
//                   <td className="px-4 py-2">
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => handleColumnNameChange(index, e.target.value)}
//                       className="border border-gray-300 rounded p-1 w-full"
//                     />
//                   </td>
//                   <td className="px-4 py-2">
//                     <select
//                       value={dataTypes[index]}
//                       onChange={(e) => handleDataTypeChange(index, e.target.value as DataType)}
//                       className="border border-gray-300 rounded p-1 w-full"
//                     >
//                       <option value="text">Text</option>
//                       <option value="email">Email</option>
//                       <option value="number">Number</option>
//                       <option value="date">Date</option>
//                       <option value="time">Time</option>
//                       <option value="radio">Radio</option>
//                       <option value="checkbox">Checkbox</option>
//                       <option value="textarea">Textarea</option>
//                       <option value="file_upload">File Upload</option>
//                       <option value="multi_select">Multi-select</option>
//                       <option value="select">Select</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-2">
//                     <button 
//                       onClick={() => handleRemoveColumn(index)}
//                       className="bg-red-100 hover:bg-red-200 text-red-600 rounded p-1"
//                       title="Remove column"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <button 
//           onClick={handleAddColumn}
//           className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg px-3 py-2 flex items-center"
//         >
//           <PlusCircle size={16} className="mr-1" />
//           Add New Column
//         </button>
//       </div>

//       {/* Data Table */}
//       <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Data Table</h2>
//           <div className="flex">
//             <button 
//               onClick={handleAddRow} 
//               className="bg-green-500 text-white rounded-lg px-3 py-1 mr-2 flex items-center"
//             >
//               <Plus size={16} className="mr-1" />
//               Add Row
//             </button>
//             {isEditing ? (
//               <button 
//                 onClick={handleSaveChanges} 
//                 className="bg-blue-500 text-white rounded-lg px-3 py-1"
//               >
//                 Save Changes
//               </button>
//             ) : (
//               <button 
//                 onClick={handleEditTable} 
//                 className="bg-yellow-500 text-white rounded-lg px-3 py-1"
//               >
//                 Edit Table
//               </button>
//             )}
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 mb-4">
//             <thead>
//               <tr className="bg-gray-100">
//                 {columnNames.map((colName, index) => (
//                   <th key={index} className="border border-gray-300 p-2 text-left">{colName}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.length > 0 ? (
//                 paginatedData.map((item, rowIndex) => (
//                   <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                     {columnNames.map((colName, colIndex) => (
//                       <td key={colIndex} className="border border-gray-300 p-2">
//                         {isEditing ? (
//                           dataTypes[colIndex] === 'checkbox' ? (
//                             <input
//                               type="checkbox"
//                               checked={!!item[colName]}
//                               onChange={(e) => handleChange(rowIndex + (pageNumber - 1) * pageSize, colName, e.target.checked)}
//                               className="w-4 h-4"
//                             />
//                           ) : dataTypes[colIndex] === 'number' ? (
//                             <input
//                               type="number"
//                               value={item[colName] as number}
//                               onChange={(e) => handleChange(rowIndex + (pageNumber - 1) * pageSize, colName, Number(e.target.value))}
//                               className="w-full border border-gray-300 rounded p-1"
//                             />
//                           ) : (
//                             <input
//                               type="text"
//                               value={String(item[colName])}
//                               onChange={(e) => handleChange(rowIndex + (pageNumber - 1) * pageSize, colName, e.target.value)}
//                               className="w-full border border-gray-300 rounded p-1"
//                             />
//                           )
//                         ) : (
//                           formatValue(item[colName], dataTypes[colIndex])
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={columnNames.length} className="border border-gray-300 p-4 text-center">
//                     No data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination */}
//         <div className="flex items-center justify-between">
//           <div>
//             <label className="mr-2">Rows per page:</label>
//             <select
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//                 setPageNumber(1); // Reset to first page when changing page size
//               }}
//               className="border border-gray-300 rounded p-1"
//             >
//               {[5, 10, 20, 50, 100].map(size => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//           </div>
//           <div className="flex items-center">
//             <span className="mr-4">
//               Page {pageNumber} of {totalPages || 1}
//             </span>
//             <button 
//               onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} 
//               disabled={pageNumber === 1} 
//               className="bg-red-500 text-white rounded-lg px-4 py-2 mr-2 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <button 
//               onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))} 
//               disabled={pageNumber === totalPages || totalPages === 0} 
//               className="bg-red-500 text-white rounded-lg px-4 py-2 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Export Options */}
//       <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
//         <h2 className="text-lg font-semibold mb-4">Export Options</h2>
//         <div className="flex flex-wrap gap-2">
//           <button 
//             onClick={handleExportJSON} 
//             className="bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center"
//           >
//             <Download size={18} className="mr-2" />
//             Export JSON
//           </button>
//           <button 
//             onClick={() => setShowJson(!showJson)} 
//             className={`${showJson ? 'bg-gray-700' : 'bg-gray-500'} text-white rounded-lg px-4 py-2`}
//           >
//             {showJson ? 'Hide JSON Preview' : 'Show JSON Preview'}
//           </button>
//         </div>
//       </div>

//       {/* JSON Preview */}
//       {showJson && (
//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-lg font-semibold">JSON Preview</h2>
//             <button 
//               onClick={() => handleCopyToClipboard(JSON.stringify(data, null, 2), 'json')}
//               className="bg-gray-200 text-black rounded-lg px-3 py-1 flex items-center"
//             >
//               {isCopied.json ? <CheckCircle2 size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
//               Copy JSON
//             </button>
//           </div>
//           <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//             <pre className="overflow-auto max-h-[300px] text-sm">
//               {JSON.stringify(data, null, 2)}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AITableGenerator;





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