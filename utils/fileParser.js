/**
 * =====================================================
 * FILE PARSER UTILITY
 * =====================================================
 *
 * Utilities to extract text from PDF and DOCX files
 *
 * IMPORTANT: This requires additional npm packages to be installed:
 * npm install pdf-parse mammoth
 */

import fs from 'fs';

// Dynamic imports to handle missing packages gracefully
let PDFParser;
let mammoth;

try {
    PDFParser = (await import('pdf-parse')).default;
} catch (error) {
    console.log('pdf-parse not installed. File upload for PDF will not work.');
}

try {
    mammoth = await import('mammoth');
} catch (error) {
    console.log('mammoth not installed. File upload for DOCX will not work.');
}

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (filePath) => {
    if (!PDFParser) {
        throw new Error('PDF parsing is not available. Please install pdf-parse: npm install pdf-parse');
    }

    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await PDFParser(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
};

/**
 * Extract text from DOCX file
 */
export const extractTextFromDOCX = async (filePath) => {
    if (!mammoth) {
        throw new Error('DOCX parsing is not available. Please install mammoth: npm install mammoth');
    }

    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } catch (error) {
        console.error('Error parsing DOCX:', error);
        throw new Error('Failed to extract text from DOCX');
    }
};

/**
 * Extract text from file based on file type
 */
export const extractTextFromFile = async (file) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
        return await extractTextFromPDF(file.path);
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
        return await extractTextFromDOCX(file.path);
    } else if (fileExtension === 'txt') {
        return fs.readFileSync(file.path, 'utf8');
    } else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT file.');
    }
};

export default {
    extractTextFromPDF,
    extractTextFromDOCX,
    extractTextFromFile,
};
