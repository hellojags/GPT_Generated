const xlsx = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = xlsx.readFile('script.xlsx');
const sheetNameList = workbook.SheetNames;

// Assuming that your data is in the first sheet
const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

// Parse the data according to the JSON structure you provided
const sections = [];
xlData.forEach(row => {
    // Assuming you have columns named 'Section', 'SectionId', 'QuestionText', 'QuestionOptions' in the Excel
    let section = sections.find(s => s.name === row.Section);
    if (!section) {
        section = {
            name: row.Section,
            id: row.SectionId,
            QuestionGroup: []
        };
        sections.push(section);
    }

    let questionOptions = row.QuestionOptions ? row.QuestionOptions.split(',') : null;
    section.QuestionGroup.push({
        QuestionText: row.QuestionText,
        QuestionOptions: questionOptions
    });
});

const jsonData = {
    Section: sections
};

// Write to a JSON file
fs.writeFile('script_converted.json', JSON.stringify(jsonData, null, 4), (err) => {
    if (err) {
        console.log('Error writing JSON to file:', err);
    } else {
        console.log('JSON file has been saved.');
    }
});
