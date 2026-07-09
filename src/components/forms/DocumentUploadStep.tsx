// ============================================================
// Step 7: Document Upload & Signature
// ============================================================

import { useEffect, useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore, useWizardStore } from '@/store';
import { Button, Card, ProgressBar } from '@/components/common';
import { DOCUMENT_REQUIREMENTS, DOCUMENT_LABELS, FILE_CONSTRAINTS } from '@/constants';
import { EmploymentType, type DocumentType, type UploadedDocument } from '@/types';
import { generateId, formatFileSize } from '@/utils';
import toast from 'react-hot-toast';

interface StepProps {
  onValidChange: (isValid: boolean) => void;
}

export default function DocumentUploadStep({ onValidChange }: StepProps) {
  const loanType = useFormStore((s) => s.loanTypeData.loanType);
  const employment = useFormStore((s) => s.employment);
  const documents = useFormStore((s) => s.documents);
  const addDocument = useFormStore((s) => s.addDocument);
  const removeDocument = useFormStore((s) => s.removeDocument);
  const updateDocumentProgress = useFormStore((s) => s.updateDocumentProgress);
  const setDocuments = useFormStore((s) => s.setDocuments);
  const setStepValid = useWizardStore((s) => s.setStepValid);

  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [sigPreview, setSigPreview] = useState<string>(documents.signatureBase64 || '');

  const requiredDocTypes = DOCUMENT_REQUIREMENTS[loanType]?.[employment.employmentType as EmploymentType] || [];

  // Check validity
  useEffect(() => {
    const hasSignature = !!sigPreview && sigPreview.length > 100;
    const hasDocuments = documents.documents.length > 0;
    const valid = hasDocuments && hasSignature;
    onValidChange(valid);
    setStepValid(7, valid);
  }, [documents.documents, sigPreview, onValidChange, setStepValid]);

  const processFile = useCallback(
    async (file: File, docType: DocumentType) => {
      const id = generateId();
      let processedFile = file;
      let preview = '';
      let base64 = '';

      // Add initial entry
      const newDoc: UploadedDocument = {
        id,
        type: docType,
        file: null,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadProgress: 0,
        uploadedAt: new Date().toISOString(),
      };
      addDocument(newDoc);

      try {
        // Compress images
        if (file.type.startsWith('image/')) {
          updateDocumentProgress(id, 20);
          processedFile = await imageCompression(file, {
            maxSizeMB: FILE_CONSTRAINTS.compressionMaxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          updateDocumentProgress(id, 60);

          // Generate preview
          preview = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(processedFile);
          });
          base64 = preview;
        } else if (file.type === 'application/pdf') {
          updateDocumentProgress(id, 50);
          preview = URL.createObjectURL(file);
          base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        updateDocumentProgress(id, 80);

        // Simulate network latency
        await new Promise((r) => setTimeout(r, 500));
        updateDocumentProgress(id, 100);

        // Update with full data
        removeDocument(id);
        addDocument({
          id,
          type: docType,
          file: null,
          fileName: processedFile.name || file.name,
          fileSize: processedFile.size,
          mimeType: processedFile.type || file.type,
          preview,
          base64,
          uploadProgress: 100,
          uploadedAt: new Date().toISOString(),
        });

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        removeDocument(id);
        toast.error(`Failed to process ${file.name}`);
        console.error('File processing error:', error);
      }
    },
    [addDocument, removeDocument, updateDocumentProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: FILE_CONSTRAINTS.maxSizeBytes,
    onDrop: (acceptedFiles) => {
      // Determine which document types are already uploaded
      const uploadedTypes = new Set(documents.documents.map(d => d.type));
      const missingTypes = requiredDocTypes.filter(type => !uploadedTypes.has(type));

      acceptedFiles.forEach((file, index) => {
        // Assign to the next missing type, or default to the first type if all are filled
        const targetType = missingTypes[index] || requiredDocTypes[0];
        processFile(file, targetType);
      });
    },
    onDropRejected: (rejections) => {
      rejections.forEach((rejection) => {
        rejection.errors.forEach((err) => {
          toast.error(err.message);
        });
      });
    },
  });

  const handleClearSignature = () => {
    sigCanvasRef.current?.clear();
    setSigPreview('');
    setDocuments({ signatureBase64: undefined });
  };

  const handleSaveSignature = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      toast.error('Please draw your signature first');
      return;
    }
    const dataUrl = sigCanvasRef.current?.toDataURL('image/png') || '';
    setSigPreview(dataUrl);
    setDocuments({ signatureBase64: dataUrl });
    toast.success('Signature captured');
  };

  const handleRemoveDoc = (id: string) => {
    removeDocument(id);
    toast.success('Document removed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">
          Documents & Signature
        </h2>
        <p className="text-white/40">
          Upload required documents and provide your digital signature
        </p>
      </div>

      <div className="space-y-8">
        {/* Required Documents List */}
        <Card title="Required Documents">
          <div className="space-y-2 mb-4">
            {requiredDocTypes.map((docType) => {
              const uploaded = documents.documents.find(
                (d) => d.type === docType && d.uploadProgress === 100
              );
              return (
                <div
                  key={docType}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      uploaded
                        ? 'bg-accent-500/100 text-white'
                        : 'bg-white/10 text-white/30'
                    }`}
                  >
                    {uploaded ? '✓' : '○'}
                  </span>
                  <span
                    className={`text-sm ${
                      uploaded
                        ? 'text-white font-medium'
                        : 'text-white/40'
                    }`}
                  >
                    {DOCUMENT_LABELS[docType]}
                  </span>
                  {uploaded && (
                    <span className="ml-auto text-xs text-white/30">
                      {formatFileSize(uploaded.fileSize)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Drag & Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
            transition-all duration-300 group
            ${
              isDragActive
                ? 'border-primary-500 bg-primary-500/10 scale-[1.02] shadow-lg shadow-primary-500/10'
                : 'border-white/10 hover:border-primary-400 hover:bg-white/5/50 hover:shadow-md'
            }
          `}
          aria-label="Upload documents by dragging and dropping or clicking"
        >
          <input {...getInputProps()} />
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative space-y-4">
            <div className={`
              w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl
              transition-all duration-300
              ${isDragActive ? 'bg-primary-100 text-primary-400 scale-110' : 'bg-white/8 text-white/40 group-hover:bg-primary-500/10 group-hover:text-primary-500'}
            `}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-white transition-colors group-hover:text-primary-400">
                {isDragActive
                  ? 'Drop your files here...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-white/40 mt-2 max-w-xs mx-auto leading-relaxed">
                Supported formats: JPEG, PNG, WebP, PDF (Max {FILE_CONSTRAINTS.maxSizeMB}MB per file)
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files Preview */}
        <AnimatePresence>
          {documents.documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-medium text-white/70">
                Uploaded Files ({documents.documents.length})
              </h3>
              {documents.documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-4 bg-white/6 rounded-xl border border-white/5 shadow-sm"
                >
                  {/* Preview thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/8 shrink-0 flex items-center justify-center">
                    {doc.preview && doc.mimeType?.startsWith('image/') ? (
                      <img
                        src={doc.preview}
                        alt={doc.fileName}
                        className="w-full h-full object-cover"
                      />
                    ) : doc.mimeType === 'application/pdf' ? (
                      <span className="text-2xl">📄</span>
                    ) : (
                      <span className="text-2xl">📎</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-white truncate">
                        {doc.fileName}
                      </p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                        {DOCUMENT_LABELS[doc.type]}
                      </span>
                    </div>
                    <p className="text-xs text-white/30">
                      {formatFileSize(doc.fileSize)}
                    </p>
                    {doc.uploadProgress < 100 && (
                      <ProgressBar
                        value={doc.uploadProgress}
                        size="sm"
                        variant="primary"
                      />
                    )}
                  </div>

                  {doc.uploadProgress === 100 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                      aria-label={`Remove ${doc.fileName}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature Canvas */}
        <Card title="Digital Signature" description="Draw your signature below using your mouse or touch. This acts as your official consent.">
          <div className="space-y-4">
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white shadow-inner relative group">
              <div className="absolute inset-0 pointer-events-none border border-transparent group-focus-within:border-primary-500 rounded-xl transition-colors z-10" />
              <SignatureCanvas
                ref={sigCanvasRef}
                penColor="#1e293b"
                canvasProps={{
                  className: 'w-full h-[180px] touch-none cursor-crosshair',
                  'aria-label': 'Signature canvas - draw your signature here',
                }}
                backgroundColor="rgba(255, 255, 255, 1)"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSignature}
                  type="button"
                >
                  Clear Canvas
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveSignature}
                  type="button"
                >
                  Save Signature
                </Button>
              </div>

              {sigPreview && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success-500/10 text-success-700 rounded-full text-sm font-semibold border border-accent-500/20 shadow-sm animate-fade-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
