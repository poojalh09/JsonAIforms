"use client";

import TabsMenu from "@/components/tabsMenu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PenSquare } from "lucide-react";

export default function ManualFormPage() {
  const router = useRouter();

  const navigateToGetStarted = () => {
    router.push("/GetStarted");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-2 mb-3">
        <div className="flex justify-end items-center m-1">
          <div className="flex items-center gap-4">
            <Button 
              onClick={navigateToGetStarted}
              variant="outline" 
              className="flex items-center gap-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-all"
            >
              <PenSquare className="h-4 w-4" />
              AI Form Generator Page
            </Button>
          </div>
        </div>
        <TabsMenu />
      </div>
    </div>
  );
}