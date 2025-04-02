import DynamicTablePage from "@/components/DynamicTablePage";

export async function generateStaticParams() {
  try {
    // Fetch the list of available table IDs from an API or data source
    const res = await fetch('http://localhost:3000/api/get-table-ids');
    if (!res.ok) {
      console.error('Failed to fetch table IDs');
      return [{ id: '1' }, { id: '2' }, { id: '3' }]; // Fallback IDs
    }
    const tableIds = await res.json();
    
    return tableIds.map(id => ({ id: String(id) }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [{ id: '1' }, { id: '2' }, { id: '3' }]; // Fallback IDs
  }
}

export default async function Page({ params }) {
    const { id } = await params;
    return <DynamicTablePage id={id} />;
}