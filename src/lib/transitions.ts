
import { HTMLMotionProps, Variant, Variants } from "framer-motion";

export const fadeIn = (
  direction: "up" | "down" | "left" | "right" | "none" = "none",
  delay = 0,
  duration = 0.4
): Variants => {
  const baseVariant: Variant = {
    opacity: 0,
  };
  
  if (direction === "up") baseVariant.y = 15;
  if (direction === "down") baseVariant.y = -15;
  if (direction === "left") baseVariant.x = 15;
  if (direction === "right") baseVariant.x = -15;
  
  return {
    hidden: baseVariant,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};

export const staggerContainer = (
  staggerChildren = 0.07,
  delayChildren = 0
): Variants => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const pageTransition: HTMLMotionProps<"div"> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

export const slideIn = (
  direction: "up" | "down" | "left" | "right",
  delay = 0,
  duration = 0.5
): Variants => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };
  
  return {
    hidden: {
      ...directions[direction],
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};

export const scaleIn = (delay = 0, duration = 0.5): Variants => {
  return {
    hidden: {
      scale: 0.95,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};
