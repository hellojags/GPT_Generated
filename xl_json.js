const xlsx = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = xlsx.readFile('UW_Script.xlsx');
const sheetNameList = workbook.SheetNames;
const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

const jsonData = { Section: [] };
let currentSection = null;

xlData.forEach(row => {
    // Check if we are in a new section
    if (!currentSection || currentSection.name !== row.Section) {
        currentSection = {
            name: row.Section,
            id: row.Section ? row.Section.replace(/\s+/g, '') : null, // Generate an ID from Section name
            QuestionGroup: []
        };
        jsonData.Section.push(currentSection);
    }

    // Add question to the current section
    if (row.Question) {
        currentSection.QuestionGroup.push({
            QuestionText: row.Question,
            QuestionOptions: row['Answer Options'] ? row['Answer Options'].split(',') : null
        });
    }
});

// Write the JSON structure to a file
fs.writeFile('uw_script_converted.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
        console.log('Error writing JSON to file:', err);
    } else {
        console.log('JSON file has been saved.');
    }
});
