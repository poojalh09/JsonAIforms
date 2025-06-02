import { getForm } from "../../utils/formStore";

export default function handler(req, res) {
    const { id } = req.query;
    const formData = getForm(id);

    if (!formData) {
        return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(formData);
}