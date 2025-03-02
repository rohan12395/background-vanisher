
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "@/lib/transitions";

const Hero = () => {
  return (
    <section className="py-10 md:py-16 overflow-hidden">
      <div className="page-container">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium tracking-wide">
              Powered by Machine Learning
            </span>
          </motion.div>
          
          <motion.h1
            variants={slideIn("up", 0.3)}
            initial="hidden"
            animate="visible"
            className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Remove Image Backgrounds
          </motion.h1>
          
          <motion.p
            variants={slideIn("up", 0.4)}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Remove backgrounds from your images in seconds with our advanced AI-powered tool.
            No signup required. Fast, free, and entirely processed in your browser.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
