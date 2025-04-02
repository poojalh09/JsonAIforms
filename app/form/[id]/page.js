import DynamicFormPage from "@/components/DynamicFormPage";

export default async function Page({ params }) {
    const { id } = await params;
    return <DynamicFormPage id={id} />;
}