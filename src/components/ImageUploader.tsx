
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Link2 } from "lucide-react";
import { scaleIn } from "@/lib/transitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (file: File | string) => void;
  isProcessing: boolean;
}

const ImageUploader = ({ onImageSelect, isProcessing }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onImageSelect(file);
        } else {
          toast.error("Please upload an image file");
        }
      }
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type.startsWith("image/")) {
          onImageSelect(file);
        } else {
          toast.error("Please upload an image file");
        }
      }
    },
    [onImageSelect]
  );

  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (imageUrl.trim()) {
        try {
          new URL(imageUrl);
          onImageSelect(imageUrl);
        } catch {
          toast.error("Please enter a valid URL");
        }
      }
    },
    [imageUrl, onImageSelect]
  );

  return (
    <motion.div
      variants={scaleIn(0.5)}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload" disabled={isProcessing}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="url" disabled={isProcessing}>
            <Link2 className="w-4 h-4 mr-2" />
            Image URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0">
          <div
            className={`drop-area neo-shadow hover-scale ${
              dragActive ? "active" : ""
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />
            
            <div className="flex flex-col items-center py-8">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Upload 
                  className="w-8 h-8 text-primary"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Upload your image
              </h3>
              <p className="text-muted-foreground mb-4 text-center max-w-sm">
                Drag and drop your image here, or click to browse
              </p>
              <Button disabled={isProcessing}>
                Select Image
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supports JPEG, PNG, WebP up to 10MB
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="mt-0">
          <div className="glass-card neo-shadow">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <h3 className="text-lg font-medium mb-2">
                Enter image URL
              </h3>
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isProcessing}
                  className="bg-white/60"
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!imageUrl.trim() || isProcessing}
                >
                  Process Image
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Some sites may block access to their images
              </p>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ImageUploader;
