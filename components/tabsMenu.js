"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import GenerateJSONForForm from "./GenerateFormJSON";
import GenerateJSONForTable from "./GenerateTableJSON";
import { FileJson, TableProperties, RefreshCw, ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TabsMenu() {
  const [activeTab, setActiveTab] = useState("table");
  
  const toggleTab = () => {
    setActiveTab(activeTab === "table" ? "form" : "table");
  };
  
  const router = useRouter();

  const navigateToLandingPage = () => {
    router.push("/"); // Change to your target route
  };

  return (
    <div className="container mx-auto py-2 mb-3">
      <div className="flex justify-between items-center m-1">
      <img src="https://lastrasbourgeoise.eu/wp-content/uploads/2018/09/eli-lilly-logo-vector.png" alt="logo" width="110" height="110" onClick={navigateToLandingPage} />
        
        <Button 
          onClick={toggleTab}
          variant="outline" 
          className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Switch to {activeTab === "table" ? "Form" : "Table"} Generator
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl bg-gray-100 h-12">
          <TabsTrigger 
            value="form" 
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md h-10"
          >
            <FileJson className="mr-2 h-5 w-5" />
            Dynamic Form
          </TabsTrigger>
          <TabsTrigger 
            value="table" 
            className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-md h-10"
          >
            <TableProperties className="mr-2 h-5 w-5" />
            Dynamic Table
          </TabsTrigger>
        </TabsList>
        
        <div className="border border-red-100 rounded-xl p-1">
          <TabsContent value="form" className="mt-0">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <FileJson className="mr-2 h-6 w-6 text-red-500" />
                  Form Generator
                </CardTitle>
                <CardDescription>
                  Create dynamic forms with custom fields and controls
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-0">
                <GenerateJSONForForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <TableProperties className="mr-2 h-6 w-6 text-red-500" />
                  Table Generator
                </CardTitle>
                <CardDescription>
                  Build interactive data tables with custom columns and types
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-0">
                <GenerateJSONForTable />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Built with shadcn/ui components • Export JSON for your applications</p>
      </div>
    </div>
  );
}