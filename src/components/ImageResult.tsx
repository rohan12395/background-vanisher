
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scaleIn } from "@/lib/transitions";
import { toast } from "sonner";

interface ImageResultProps {
  imageUrl: string;
  onReset: () => void;
}

const ImageResult = ({ imageUrl, onReset }: ImageResultProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsImageLoaded(true);
    img.src = imageUrl;
  }, [imageUrl]);

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `removed-bg-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <motion.div
      variants={scaleIn(0.3)}
      initial="hidden"
      animate={isImageLoaded ? "visible" : "hidden"}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex flex-col items-center gap-6">
        <div
          className="relative overflow-hidden rounded-2xl w-full max-w-2xl neo-shadow"
          style={{
            background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <img
            src={imageUrl}
            alt="Processed image with background removed"
            className="w-full h-auto object-contain max-h-[70vh]"
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Process Another
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageResult;
