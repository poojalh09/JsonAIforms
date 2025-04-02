"use client"; // Ensure it's a Client Component

import { useEffect, useState } from "react";
import DynamicForm from "@/components/DynamicForm";

export default function DynamicFormPage({ id }) {
    const [formDefinition, setFormDefinition] = useState(null);

    useEffect(() => {
        if (!id) return;

        async function fetchForm() {
            try {
                console.log("Fetching form for ID:", id);
                const res = await fetch(`/api/get?id=${id}`);
                if (!res.ok) throw new Error("Form not found");
                const data = await res.json();
                console.log("Fetched Form Data:", data);
                setFormDefinition(data.formDefinition);
            } catch (error) {
                console.error("Error fetching form:", error);
            }
        }

        fetchForm();
    }, [id]);

    //if (!formDefinition) return <p className="text-center text-gray-500">Loading form...</p>;

    return <DynamicForm formDefinition={formDefinition} />;
}