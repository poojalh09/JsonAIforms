import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "formStore.json");

// Read stored forms from file (if exists)
const loadForms = () => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    return {};
};

// Save forms to file
const saveForms = (forms) => {
    fs.writeFileSync(filePath, JSON.stringify(forms, null, 2));
};

let formStore = loadForms();

export const storeForm = (id, data) => {
    formStore[id] = data;
    saveForms(formStore);
};

export const getForm = (id) => {
    return formStore[id] || null;
};