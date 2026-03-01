import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";
import '../../css/Resume.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ResumeAutoFill = ({ onParsed }) => {
    const { addToast } = useToast();
    const [isDragging, setIsDragging] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const validateFile = (file) => {
        if (!file) return false;

        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
            setError('Please upload a PDF or DOCX file.');
            return false;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size too large. Please upload a file under 5MB.');
            return false;
        }

        setError(null);
        return true;
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            await processFile(file);
        }
    };

    const handleFileInput = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            await processFile(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const extractPdfText = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            extractedText += pageText + "\n";
        }

        return extractedText;
    };

    const extractDocxText = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    };

    const processFile = async (file) => {
        if (!validateFile(file)) return;

        setIsParsing(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            let extractedText = "";

            if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                extractedText = await extractPdfText(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
                extractedText = await extractDocxText(file);
            } else {
                throw new Error("Unsupported file type.");
            }

            if (!extractedText || extractedText.trim() === "") {
                throw new Error("Extracted text is empty. Could not read the file.");
            }

            console.log("Extracted Text:", extractedText);

            // Send extracted text to backend AI parser
            const response = await axios.post("/api/ai/parse-resume", extractedText, {
                headers: {
                    "Content-Type": "text/plain"
                }
            });

            const parsedData = response.data;
            console.log("Parsed Data from Backend:", parsedData);

            addToast('Resume parsed successfully!', 'success');

            if (onParsed) {
                onParsed(parsedData);
            }

        } catch (err) {
            console.error("Resume parsing error:", err);
            setError(err.message || 'Failed to parse resume. Please try again.');
            addToast('Failed to parse resume', 'error');
        } finally {
            setIsParsing(false);
        }
    };

    return (
        <div className="resume-upload-container">
            {!isParsing ? (
                <>
                    <div className="resume-header">
                        <h2 className="resume-title">Auto-fill with Resume</h2>
                        <p className="resume-subtitle">
                            Upload your PDF or DOCX resume to instantly create your portfolio.
                        </p>
                    </div>

                    <div
                        className={`drop-zone ${isDragging ? 'active' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="file-input-hidden"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileInput}
                            ref={fileInputRef}
                        />
                        <div className="drop-icon-wrapper">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <h3 className="drop-text">Click or drag and drop</h3>
                        <p className="drop-subtext">PDF or DOCX up to 5MB</p>
                    </div>

                    {error && (
                        <div className="resume-error">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}
                </>
            ) : (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <h3 className="loading-text">Parsing Resume...</h3>
                    <p className="loading-subtext">Extracting skills, experience, and details.</p>
                </div>
            )}
        </div>
    );
};

export default ResumeAutoFill;
