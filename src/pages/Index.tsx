
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { removeBackground, loadImage, loadImageFromUrl } from "@/utils/imageProcessor";
import { pageTransition } from "@/lib/transitions";
import { toast } from "sonner";
import Hero from "@/components/Hero";
import ImageUploader from "@/components/ImageUploader";
import ProcessingStatus from "@/components/ProcessingStatus";
import ImageResult from "@/components/ImageResult";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

// Add huggingface dependency
<lov-add-dependency>@huggingface/transformers@latest</lov-add-dependency>
<lov-add-dependency>framer-motion@latest</lov-add-dependency>

const Index = () => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [progress, setProgress] = useState(0);

  const handleImageSelect = useCallback(async (source: File | string) => {
    try {
      setIsProcessing(true);
      setStatus("Preparing image...");
      setProgress(0.05);
      
      let imageElement: HTMLImageElement;
      
      // Load the image from file or URL
      if (typeof source === "string") {
        toast.info("Loading image from URL...");
        imageElement = await loadImageFromUrl(source);
      } else {
        imageElement = await loadImage(source);
      }
      
      // Process the image
      const updateStatus = (statusText: string, progressValue = 0) => {
        setStatus(statusText);
        setProgress(progressValue);
      };
      
      const processedBlob = await removeBackground(imageElement, updateStatus);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedImage(processedUrl);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image. Please try another one.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
    setProcessedImage(null);
    setStatus("Initializing...");
    setProgress(0);
  }, [processedImage]);

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen flex flex-col"
    >
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="page-container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">BackgroundVanish</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Hero />
        
        <section className="flex-1 py-10">
          <div className="page-container">
            {!processedImage && !isProcessing && (
              <ImageUploader
                onImageSelect={handleImageSelect}
                isProcessing={isProcessing}
              />
            )}
            
            {isProcessing && (
              <ProcessingStatus
                status={status}
                progress={progress}
              />
            )}
            
            {processedImage && !isProcessing && (
              <ImageResult
                imageUrl={processedImage}
                onReset={handleReset}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-6 mt-10">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BackgroundVanish. All rights reserved.
            </p>
            <div className="text-sm text-muted-foreground">
              <span>Powered by </span>
              <a 
                href="https://huggingface.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Hugging Face
              </a>
              <span> transformers.js</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
