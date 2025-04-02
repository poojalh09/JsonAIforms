"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileJson, TableProperties, ArrowRightLeft, PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import AIFormGenerator from "@/components/AIFormGenerator";
import AITableGenerator from "@/components/AITableGenerator";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from 'next/link'

import Image from 'next/image'

export default function Home() {
  const [activeTab, setActiveTab] = useState("form");
  const router = useRouter();

  const toggleTab = () => {
    setActiveTab(activeTab === "table" ? "form" : "table");
  };

  const navigateToManualForm = () => {
    router.push("/manual-form");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-2 mb-3">
        <div className="flex justify-between items-center m-1">
          <Image 
            src="https://lastrasbourgeoise.eu/wp-content/uploads/2018/09/eli-lilly-logo-vector.png" 
            alt="logo" 
            width="110" 
            height="110" 
            className="cursor-pointer"
          />
          <div className="flex items-center gap-4">
            <Link href="/view-forms">
              <Button variant="outline">View Forms</Button>
            </Link>
            <ThemeToggle />
            <div className="flex gap-4">
              <Button 
                onClick={navigateToManualForm}
                variant="outline" 
                className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-all"
              >
                <PenSquare className="h-4 w-4" />
                Manual Form
              </Button>
              <Button 
                onClick={toggleTab}
                variant="outline" 
                className="flex items-center gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Switch to {activeTab === "table" ? "Form" : "Table"} Generator
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl bg-muted h-12">
            <TabsTrigger 
              value="form" 
              className="data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-md h-10"
            >
              <FileJson className="mr-2 h-5 w-5" />
              AI Form Generator
            </TabsTrigger>
            <TabsTrigger 
              value="table" 
              className="data-[state=active]:bg-background data-[state=active]:text-red-600 data-[state=active]:shadow-md h-10"
            >
              <TableProperties className="mr-2 h-5 w-5" />
              AI Table Generator
            </TabsTrigger>
          </TabsList>
          
          <div className="border border-red-100 dark:border-red-900/20 rounded-xl p-1">
            <TabsContent value="form" className="mt-0">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileJson className="mr-2 h-6 w-6 text-red-500" />
                    AI Form Generator
                  </CardTitle>
                  <CardDescription>
                    Create dynamic forms using AI - just describe what you need
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 py-0">
                  <AIFormGenerator />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <TableProperties className="mr-2 h-6 w-6 text-red-500" />
                    AI Table Generator
                  </CardTitle>
                  <CardDescription>
                    Generate interactive data tables using AI assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 py-0">
                  <AITableGenerator />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Built with Next.js • shadcn/ui • OpenAI</p>
        </div>
      </div>
    </div>
  );
}