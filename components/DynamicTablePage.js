"use client"; // Ensure it's a Client Component

import { useEffect, useState } from "react";
import DynamicTable from "./DynamicTable";

export default function DynamicTablePage({ id }) {
    const [tableDefinition, setTableDefinition] = useState(null);

    useEffect(() => {
        if (!id) return;

        async function fetchTable() {
            try {
                console.log("Fetching form for ID:", id);
                const res = await fetch(`/api/get?id=${id}`);
                if (!res.ok) throw new Error("Form not found");
                const data = await res.json();
                console.log("Fetched Form Data:", data);
                setTableDefinition(data.tableDefinition);
            } catch (error) {
                console.error("Error fetching form:", error);
            }
        }

        fetchTable();
    }, [id]);

    //if (!formDefinition) return <p className="text-center text-gray-500">Loading form...</p>;

    return <DynamicTable tableDefinition={tableDefinition} />;
}