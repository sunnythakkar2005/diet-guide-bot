import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
}

const ACCEPTED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const UploadDropzone = ({ onFileSelected }: UploadDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!ACCEPTED.includes(file.type)) {
      alert("Unsupported file type. Please upload a PDF or image.");
      return;
    }
    onFileSelected(file);
  };

  return (
    <div
      className="card-elevated p-6 md:p-8 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-full border p-3">
          <Upload />
        </div>
        <h2 className="text-xl font-semibold">Upload your blood report</h2>
        <p className="text-sm text-muted-foreground max-w-prose">
          Drag & drop a PDF or image, or choose a file from your device.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
          >
            Choose file
          </Button>
          <span className="text-sm text-muted-foreground">or drop here</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
};

export default UploadDropzone;
