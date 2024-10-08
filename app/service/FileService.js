import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//! for single file upload 
export const uploadSingleFileService = async (req) => {
    try {
        // 'file' is the name attribute in the form
        const uploadedFile = req.files?.file;

        // Set upload path
        const uploadPath = path.join(__dirname, '../../uploads', Date.now() + "-" + uploadedFile.name);

        // Use the mv() method to place the file on the server
        await uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return { status: true, data: "Error occurred while uploading the file." };
            }
        });
        return { status: true, data: "File uploaded successfully!" };
    } catch (err) {
        return { status: false, data: err.toString() };
    }

}

//! upload multiple images
export const uploadMultipleFileService = async (req) => {
    console.log(req.files.file);


    try {
        let files = req.files?.file
        for (let i = 0; i < files.length; i++) {
            const uploadPath = path.join(__dirname, '../../uploads', Date.now() + "-" + files[i].name);
            files[i].mv(uploadPath, (err) => {
                if (err) {
                    return { status: true, data: "Error occurred while uploading the file." };
                }
            });
        }
        return { status: true, data: "File uploaded successfully!" };
    } catch (err) {
        return { status: false, data: err.toString() };
    }

}

// getUploadFileService
export const getUploadFileService = (req, res) => {
    try {
        const filename = req.params.fileName;
        const filePath = path.join(__dirname, '../../uploads', filename);
        return filePath
    } catch (err) {
        return { status: false, data: err.toString() };
    }
}

// deleteSingleFileService
export const deleteSingleFileService = (req, res) => {
    try {
        const filename = req.params.fileName;
        const filePath = path.join(__dirname, '../../uploads', filename);
        // Check if file exists
        if (fs.existsSync(filePath) === true) {
            fs.unlink(filePath, (err) => {
                if (err !== null) {
                    return { status: false, data: "Error Deleting File!" };
                }
            });
            return { status: true, data: "File deleted successfully!" };
        } else {
            return { status: false, data: "File not found!" };
        }
    } catch (err) {
        return { status: false, data: err.toString() };
    }
};

// delete Single or MultipleFileService
export const deleteSingleOrMultipleFileService = (req, res) => {
    try {
        const files = req.body?.file;

        if (!files || !Array.isArray(files)) {
            return { status: false, data: "No files provided or invalid input" };
        }

        let deletedFiles = [];
        let notFoundFiles = [];
        let errorFiles = [];

        // Loop over each file and handle its deletion
        files.forEach((file) => {
            const filePath = path.join(__dirname, '../../uploads', file);

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        errorFiles.push(file);
                    }
                });
                deletedFiles.push(file);
            } else {
                notFoundFiles.push(file);
            }
        });

        // Return the result after processing all files
        return {
            status: true, data: {
                message: "File deletion process complete",
                deletedFiles,
                notFoundFiles,
                errorFiles
            }
        };
    } catch (err) {
        return { status: false, data: err.toString() };
    }
};