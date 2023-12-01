/*
*  Displays the generated words (relies on useWords hook)
*/

import { motion } from "framer-motion";

const GeneratedWords = ({ words }: { words: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="text-slate-500"
    >
      {words}
    </motion.div>
  );
};

export default GeneratedWords;