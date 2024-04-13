const fs = require('fs');
const path = require('path');
const FileHandler = require('./FileHandler');
const config = require('./config.json');

const fileHandler = new FileHandler(config);

// Function to process files
async function processFiles() {
    try {
        while (true) {
            const filesData = await fileHandler.processFiles();
            if (filesData.length === 0) {
                console.log('No files found. Retry after 5 minutes.');
                await wait(5 * 60 * 1000); // Wait for 5 minutes before retrying
                continue; // Skip the rest of the loop and start again
            }
            for (const fileData of filesData) {
                const { fileName, data } = fileData;
                const rates = extractRates(data);
                for (const rateName in rates) {
                    const rateData = rates[rateName];
                    const filePath = path.join(__dirname, 'DB', `${rateName}.txt`); // Use __dirname to refer to the current directory
                    await appendToFile(filePath, rateData);
                }
            }
            await wait(5 * 60 * 1000); // Wait for 5 minutes before processing files again
        }
    } catch (error) {
        console.error('Error processing files:', error);
        await wait(5 * 60 * 1000); // Wait for 5 minutes before retrying after an error
        processFiles(); // Retry processing files
    }
}

// Function to extract rates from data
function extractRates(data) {
    const jsonData = JSON.parse(data);
    const rates = {};
    
    // Check if the JSON data has the necessary structure
    if (jsonData && jsonData.Rates && jsonData.Rates.Header && jsonData.Rates.Header.RateType) {
        const rateType = jsonData.Rates.Header.RateType;
        const rateData = jsonData.Rates.Details.Detail;
        rates[rateType] = JSON.stringify(rateData);
    } else {
        console.error('Invalid JSON data format. Cannot extract rates.');
    }
    
    return rates;
}

// Function to append data to a file
async function appendToFile(filePath, data) {
    // Create directory if it doesn't exist
    const directory = path.dirname(filePath);
    try {
        await fs.promises.mkdir(directory, { recursive: true });
    } catch (err) {
        console.error(`Error creating directory ${directory}:`, err);
        throw err;
    }

    // Append data to file
    try {
        await fs.promises.appendFile(filePath, data + '\n');
        console.log(`Data appended to file ${filePath}`);
    } catch (err) {
        console.error(`Error appending data to file ${filePath}:`, err);
        throw err;
    }
}

// Function to wait for a specified duration
function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// Start processing files
processFiles();
