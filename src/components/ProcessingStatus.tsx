
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { fadeIn } from "@/lib/transitions";

interface ProcessingStatusProps {
  status: string;
  progress: number;
}

const ProcessingStatus = ({ status, progress }: ProcessingStatusProps) => {
  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      animate="visible"
      className="glass-card neo-shadow w-full max-w-2xl mx-auto py-8"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center animate-pulse-subtle">
          {status}
        </h3>
        
        <Progress value={progress * 100} className="w-full h-2" />
        
        <p className="text-sm text-center text-muted-foreground">
          Please don't close this page while processing
        </p>
      </div>
    </motion.div>
  );
};

export default ProcessingStatus;
