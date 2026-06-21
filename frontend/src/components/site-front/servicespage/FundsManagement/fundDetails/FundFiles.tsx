"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { documentService } from "@/services/documentService";

interface FundFilesProps {
  fundData: any;
}

const FundFiles: React.FC<FundFilesProps> = ({ fundData }) => {
  const params = useParams();
  const fundId = params?.id as string;

  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents data
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!fundId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await documentService.getDocumentsByFundId(fundId);
        const documentsData = response?.data || [];
        setDocuments(documentsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [fundId]);

  const PdfIcon = () => (
    <div className="w-12 h-14 bg-red-500 rounded-lg flex items-center justify-center shrink-0 relative">
      <span className="text-white text-xs font-bold">PDF</span>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-700 rounded-sm" />
    </div>
  );

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

return (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-6">Files</h1>

    {/* Loading State */}
    {isLoading && (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
        </div>
      </div>
    )}

    {/* Error State */}
    {error && (
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="text-center text-red-500 dark:text-red-400">
          <p>Error: {error}</p>
        </div>
      </div>
    )}

    {/* Documents List */}
    {!isLoading && !error && (
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No documents available</p>
            </div>
          </div>
        ) : (
          documents.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all group"
            >
              <PdfIcon />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 dark:text-gray-50 text-sm font-medium leading-snug group-hover:text-[#00437A] dark:group-hover:text-blue-400 transition-colors">
                  {doc.document}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-orange-500 dark:text-orange-400 text-xs">
                    {formatDate(doc.upload_time)}
                  </p>
                  <span className="text-gray-400 dark:text-gray-600 text-xs">•</span>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {formatFileSize(doc.file_size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Download Button */}
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.linkdoc}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#00437A] dark:bg-blue-700 text-white text-xs font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </a>

                {/* View Button */}
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.linkdoc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-50 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    )}
  </div>
);
};

export default FundFiles;