import { v4 as uuidv4 } from "uuid";
import { storeForm } from "../../utils/formStore";

export default function handler(req, res) {
    if (req.method === "POST") {
        const id = uuidv4();
        storeForm(id, req.body); // Store form persistently

        res.status(200).json({ id });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}