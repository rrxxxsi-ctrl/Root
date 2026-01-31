import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="p-3 rounded-xl glass text-foreground/80 hover:text-foreground transition-colors flex items-center justify-center gap-2"
      aria-label="Toggle language"
    >
      <Globe size={20} />
      <span className="text-xs font-bold uppercase">{language}</span>
    </motion.button>
  );
}