"use client";

import { motion } from "framer-motion";
import {
  FaHeart,
  FaShieldAlt,
  FaComments,
} from "react-icons/fa";

const features = [
  {
    icon: FaHeart,
    title: "Smart Matching",
    description: "AI-powered compatibility",
  },
  {
    icon: FaShieldAlt,
    title: "Safe & Secure",
    description: "Verified profiles only",
  },
  {
    icon: FaComments,
    title: "Real Connections",
    description: "Meaningful conversations",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AnimatedFeatures() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-pink-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 + index * 0.1,
            }}
            className="p-4 bg-gradient-to-br from-pink-500 to-red-500 rounded-full text-white mb-4"
          >
            <feature.icon size={28} />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.3 + index * 0.1,
            }}
            className="text-2xl font-semibold text-gray-800 mb-3"
          >
            {feature.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4 + index * 0.1,
            }}
            className="text-gray-600 text-center text-lg"
          >
            {feature.description}
          </motion.p>
        </motion.div>
      ))}
    </motion.div>
  );
}
