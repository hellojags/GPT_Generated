const xlsx = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = xlsx.readFile('UW_Script.xlsx');
const sheetNameList = workbook.SheetNames;
const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

const jsonData = { Section: [] };
let currentSection = null;
let currentQuestion = null;

xlData.forEach(row => {
    if (row.Section) {
        // If new section starts, save the current section and start a new one
        if (!currentSection || currentSection.name !== row.Section) {
            currentSection = {
                name: row.Section,
                id: row.Section ? row.Section.replace(/\s+/g, '') : null, // Generate an ID from Section name
                QuestionGroup: []
            };
            jsonData.Section.push(currentSection);
        }
    }

    if (row.Question) {
        // If a new question starts, add the current question to the section and start a new one
        currentQuestion = {
            QuestionText: row.Question,
            QuestionOptions: []
        };
        currentSection.QuestionGroup.push(currentQuestion);
    } else if (row['Answer Options'] && currentQuestion) {
        // If there's an answer option and we are currently processing a question, add the option
        currentQuestion.QuestionOptions.push(row['Answer Options']);
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
