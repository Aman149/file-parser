# File Processor

This project is a JSON data processor designed to parse JSON files located in a specified directory, extract relevant information, and store it in text files. It is built using Node.js and follows a microservices architecture.

### Features

* File Processing: Parses JSON files located in the input directory.
* Data Extraction: Extracts relevant data from the JSON files based on predefined headers.
* Timestamping: Appends a timestamp to processed files before storing them.
* Modular Architecture: Utilizes microservices architecture for scalability and maintainability.
* Error Handling: Moves files to an error directory in case of parsing errors.


## Project Structure

The project consists of the following components:

* `server.js`: Main entry point for the application. Continuously processes JSON files and delegates processing to the FileHandler module.
* `FileHandler.js`: Module responsible for handling file operations, including reading, parsing, and moving files.
* `config.json`: Configuration file containing directory paths and other settings.


## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/json-data-processor.git
```

2. Navigate to the project directory:
```
cd json-data-processor
```

3. Install dependencies:
```
npm install
```

## Configuration

Modify the `config.json` file to specify the input directory `(importLocation)`, success folder `(successFolder)`, and error folder `(errorFolder)`.

```
{
  "importLocation": "./import/input",
  "successFolder": "./import/processed",
  "errorFolder": "./import/error",
  "pollingInterval": 300000, // Optional: Polling interval in milliseconds (default: 5 minutes)
  "mongoURI": "mongodb://localhost:27017/your_database_name" // Optional: MongoDB connection URI
}
```

## Usage

To start the JSON data processor, run the following command:
```
npm start
```
The processor will continuously monitor the input directory for JSON files, parse them, extract relevant data, and store the processed files in the success folder. In case of parsing errors, files will be moved to the error folder.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
