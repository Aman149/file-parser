const fs = require('fs').promises;
const path = require('path');
const config = require('./config.json');

class FileHandler {
    constructor(config) {
        this.inputFolder = config.importLocation;
        this.processedFolder = config.successFolder;
        this.errorFolder = config.errorFolder;
    }

    async processFiles() {
        try {
            const files = await fs.readdir(this.inputFolder);
            if (files.length === 0) {
                console.log('No files found.');
                return [];
            }
            const filesData = [];
            for (const file of files) {
                const filePath = path.join(this.inputFolder, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile() && path.extname(filePath) === '.json') {
                    const data = await fs.readFile(filePath, 'utf-8');
                    filesData.push({ fileName: file, data });
                    await this.moveFile(filePath, path.join(this.processedFolder, `${this.getFileNameWithTimestamp(file)}`));
                } else {
                    console.log(`Skipping file: ${file}`);
                }
            }
            return filesData;
        } catch (err) {
            console.error(`Error processing files in directory: ${this.inputFolder} : `, err);
            throw err;
        }
    }

    async moveFile(source, destination) {
        try {
            await fs.rename(source, destination);
        } catch (err) {
            console.error(`Error moving file from ${source} to ${destination}: `, err);
            throw err;
        }
    }

    // Function to get filename with timestamp
    getFileNameWithTimestamp(filename) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const basename = path.basename(filename, path.extname(filename));
        return `${basename}_${timestamp}${path.extname(filename)}`;
    }
}

module.exports = FileHandler;
