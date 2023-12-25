/*
*  Displays the test results (animated!)
*/

import { motion } from "framer-motion";
import { State } from "../hooks/useEngine";
import { formatPercentage } from "../utils/helpers";

const Results = ({
  state,
  errors,
  accuracyPercentage,
  total,
  wpm,
  className = "",
}: {
  state: State;
  errors: number;
  accuracyPercentage: number;
  total: number;
  wpm: number;
  className?: string;
}) => {
  if (state !== "finish") {
    return null;
  }

  const initial = { opacity: 0 };
  const animate = { opacity: 1 };

  return (
    <motion.ul
      initial={initial}
      animate={animate}
      className={`flex flex-col items-center space-y-3 ${className}`}
    >
      <motion.li
        initial={initial}
        animate={animate} 
        transition={{ duration: 0.3 }}
        className="text-xl font-semibold text-mainColor"
      >
        Results
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 0.5}}
      >
        <span className="text-subColorAlt">WPM: </span>
        <span className="text-mainColor">{wpm}</span>
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 1.0 }}
      >
        <span className="text-subColorAlt">Accuracy: </span> 
        <span className="text-mainColor">{formatPercentage(accuracyPercentage)}</span>
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 1.5 }}
      >
        <span className="text-subColorAlt">Errors: </span> 
        <span className="text-mainColor">{errors}</span>
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 2.0 }}
      >
        <span className="text-subColorAlt">Total Typed: </span>
        <span className="text-mainColor">{total}</span>
      </motion.li>
    </motion.ul>
  );
};

export default Results;