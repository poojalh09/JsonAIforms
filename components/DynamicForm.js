
"use client";

import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, X, Plus, Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const inputStyles = "bg-gray-50 focus:bg-white transition-colors duration-200";
const selectTriggerStyles = "bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors duration-200";
const buttonOutlineStyles = "bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors duration-200";
const radioStyles = "data-[state=checked]:before:translate-x-[0.3125rem] data-[state=checked]:before:translate-y-[0.3125rem]";

// Helper function to generate unique field names
const generateUniqueFieldNames = (fields) => {
  const seenFields = new Set();
  return fields.map(field => {
    let uniqueName = field.name;
    let counter = 1;
    while (seenFields.has(uniqueName)) {
      uniqueName = `${field.name}_${counter++}`;
    }
    seenFields.add(uniqueName);
    return { ...field, _uniqueName: uniqueName };
  });
};

export default function DynamicForm({ formDefinition }) {
  // Initialize all state and form hooks at the top level
  const [tagFields, setTagFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
    // Generate default values based on formDefinition
  const defaultValues = useMemo(() => {
    if (!formDefinition) return {};
    const fields = generateUniqueFieldNames(formDefinition.fields);
    return fields.reduce((acc, field) => {
      acc[field._uniqueName] = field.type === "checkbox" ? [] : "";
      return acc;
    }, {});
  }, [formDefinition]);

  // Initialize form with default values
  const form = useForm({ defaultValues });
  
  // Generate fields with unique names for rendering
  const fieldsWithUniqueNames = useMemo(() => {
    return formDefinition ? generateUniqueFieldNames(formDefinition.fields) : [];
  }, [formDefinition]);
  
  // Handle loading state
  if (!formDefinition) {
    return <p className="text-center text-gray-500">Loading form...</p>;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Form Data Submitted:", { ...data, tagFields });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagInput = (e, fieldName) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTags = [...(tagFields[fieldName] || []), e.target.value.trim()];
      setTagFields((prev) => ({
        ...prev,
        [fieldName]: newTags,
      }));
      
      form.setValue(fieldName, newTags); 
      form.trigger(fieldName);
  
      e.target.value = "";
      e.preventDefault();
    }
  };
  
  const removeTag = (index, fieldName) => {
    const newTags = tagFields[fieldName].filter((_, i) => i !== index);
    setTagFields((prev) => ({
      ...prev,
      [fieldName]: newTags,
    }));
  
    form.setValue(fieldName, newTags); // Update form value
    form.trigger(fieldName); // Revalidate field
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            {formDefinition.title}
          </CardTitle>
          {formDefinition.description && (
            <CardDescription>{formDefinition.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>Form submitted successfully!</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ScrollArea className="h-[60vh] pr-4">
                <div className={`grid ${formDefinition.layout} gap-6`}>
                  {fieldsWithUniqueNames.map((field) => (
                    <div key={field._uniqueName} className={field.position}>
                      <FormField
                        control={form.control}
                        name={field._uniqueName}
                        rules={{
                          validate: (value) =>
                            !field.required || (value?.length > 0) || `${field.label} is required`,
                        }}
                        render={({ field: formField }) => (
                          
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </FormLabel>
                            {field.description && (
                              <FormDescription>{field.description}</FormDescription>
                            )}
                            <FormControl>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {field.type === "combobox" ? (
                                      <Popover className>
                                        <PopoverTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            className={`w-full justify-between ${buttonOutlineStyles}`}
                                          >
                                            {formField.value || "Select an option"}
                                            <Search className="ml-2 h-4 w-4 text-gray-400" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                          <Command>
                                            <CommandInput 
                                              placeholder="Search options..." 
                                              className={inputStyles}
                                            />
                                            <CommandList>
                                              <CommandEmpty>No options found</CommandEmpty>
                                              <CommandGroup>
                                                {field.options.map((option) => (
                                                  <CommandItem
                                                    key={option}
                                                    value={option}
                                                    onSelect={() => formField.onChange(option)}
                                                  >
                                                    {option}
                                                  </CommandItem>
                                                ))}
                                              </CommandGroup>
                                            </CommandList>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                    ) : field.type === "select" ? (
                                      <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                                        <SelectTrigger className={selectTriggerStyles}>
                                          <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {field.options?.length > 0 ? (
                                                field.options
                                            .filter((option) => typeof option === "string" && option.trim() !== "") // Ensure valid non-empty options
                                            .map((option) => (
                                            <SelectItem key={option} value={option}>
                                              {option}
                                            </SelectItem>
                                            ))
                                            ) : ( <SelectItem value="default" disabled>
                                              No options available
                                            </SelectItem>
                                          )}
                                        </SelectContent>
                                      </Select>
                                    ) : field.type === "radio" ? (
                                      <RadioGroup
                                        onValueChange={formField.onChange}
                                        defaultValue={formField.value}
                                        className="flex flex-col space-y-2"
                                      >
                                        {field.options.map((option) => (
                                          <div key={option} className="flex items-center space-x-3">
                                            <RadioGroupItem
                                              value={option}
                                              id={`${field._uniqueName}-${option}`}
                                              className={`w-4 h-4 before:w-2 before:h-2 before:content-[''] ${radioStyles}`}
                                            />
                                            <FormLabel htmlFor={`${field._uniqueName}-${option}`}>
                                              {option}
                                            </FormLabel>
                                          </div>
                                        ))}
                                      </RadioGroup>
                                    ) : field.type === "checkbox" ? (
                                      <div className="grid grid-cols-2 gap-4">
                                        {field.options.map((option) => (
                                          <div key={option} className="flex items-center space-x-3">
                                            <Checkbox
                                              onCheckedChange={(checked) => {
                                              const currentValues = form.getValues(field._uniqueName) || [];
                                              if (checked) {
                                                  form.setValue(field._uniqueName, [...currentValues, option]); // Add new option
                                                   } else {
                                                    form.setValue(field._uniqueName, currentValues.filter((item) => item !== option)); // Remove option
                                                    }
                                                  }}
                                                className="bg-gray-50 border-gray-300"
                                              />
                                            <FormLabel>{option}</FormLabel>
                                          </div>
                                        ))}
                                      </div>
                                    ) : field.type === "textarea" ? (
                                      <Textarea {...formField} className={`min-h-32 ${inputStyles}`} />
                                    ) : field.type === "switch" ? (
                                      <div className="flex items-center space-x-2">
                                        <Switch
                                          checked={formField.value}
                                          onCheckedChange={formField.onChange}
                                        />
                                        <span className="text-sm text-gray-500">
                                          {formField.value ? "Enabled" : "Disabled"}
                                        </span>
                                      </div>
                                    ) : field.type === "slider" ? (
                                      <div className="space-y-4">
                                        <Slider
                                          defaultValue={[formField.value || 50]}
                                          max={100}
                                          step={1}
                                          onValueChange={(val) => formField.onChange(val[0])}
                                          className="w-full"
                                        />
                                        <div className="text-sm text-gray-500 text-center">
                                          Value: {formField.value || 50}
                                        </div>
                                      </div>
                                    ) : field.type === "date" ? (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !formField.value && "text-gray-500",
                                              buttonOutlineStyles
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formField.value ? format(formField.value, "PPP") : "Pick a date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={formField.value}
                                            onSelect={formField.onChange}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    ) : field.type === "tags" ? (
                                      <div className="space-y-2">
                                        <div className="flex space-x-2">
                                          <Input
                                            type="text"
                                            placeholder="Type and press Enter..."
                                            onKeyDown={(e) => handleTagInput(e, field._uniqueName)}
                                            className={inputStyles}
                                          />
                                          
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {(tagFields[field._uniqueName] || []).map((tag, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="px-3 py-1 space-x-1"
                                            >
                                              <span>{tag}</span>
                                              <button
                                                type="button"
                                                onClick={() => removeTag(index, field._uniqueName)}
                                                className="text-gray-500 hover:text-gray-700"
                                              >
                                                <X className="h-3 w-3" />
                                              </button>
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <Input 
                                        type={field.type} 
                                        {...formField} 
                                        className={inputStyles}
                                      />
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{field.tooltip || `Enter ${field.label.toLowerCase()}`}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="sticky bottom-0 pt-6 bg-white border-t">
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


// export default function DynamicForm({ formDefinition }) {
//   if (!formDefinition) {
//     return <p className="text-center text-gray-500">Loading form...</p>;
//   }

//   const form = useForm({
//     defaultValues: formDefinition.fields.reduce((acc, field) => {
//       acc[field.name] = field.type === "checkbox" ? [] : "";
//       return acc;
//     }, {}),
//   });

//   const [tagFields, setTagFields] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
//       console.log("Form Data Submitted:", { ...data, tagFields });
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 3000);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleTagInput = (e, fieldName) => {
//     if (e.key === "Enter" && e.target.value.trim() !== "") {
//       const newTags = [...(tagFields[fieldName] || []), e.target.value.trim()];
//       setTagFields((prev) => ({
//         ...prev,
//         [fieldName]: newTags,
//       }));

//       form.setValue(fieldName, newTags);
//       form.trigger(fieldName);

//       e.target.value = "";
//       e.preventDefault();
//     }
//   };

//   const removeTag = (index, fieldName) => {
//     const newTags = tagFields[fieldName].filter((_, i) => i !== index);
//     setTagFields((prev) => ({
//       ...prev,
//       [fieldName]: newTags,
//     }));

//     form.setValue(fieldName, newTags);
//     form.trigger(fieldName);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <Card className="max-w-2xl mx-auto shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
//             {formDefinition.title}
//           </CardTitle>
//           {formDefinition.description && (
//             <CardDescription>
//               {typeof formDefinition.description === "string"
//                 ? formDefinition.description
//                 : JSON.stringify(formDefinition.description)}
//             </CardDescription>
//           )}
//         </CardHeader>
//         <CardContent>
//           {showSuccess && (
//             <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
//               <AlertDescription>Form submitted successfully!</AlertDescription>
//             </Alert>
//           )}

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <ScrollArea className="h-[60vh] pr-4">
//                 <div className={`grid ${formDefinition.layout} gap-6`}>
//                   {formDefinition.fields.map((field) => (
//                     <div key={field.name} className={field.position}>
//                       {/* Render field logic */}
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>

//               <div className="sticky bottom-0 pt-6 bg-white border-t">
//                 <Button
//                   type="submit"
//                   className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center space-x-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       <span>Submitting...</span>
//                     </div>
//                   ) : (
//                     "Submit"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }