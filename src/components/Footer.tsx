
import { ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="p-4 text-center text-sm text-gray-600 bg-white/50 backdrop-blur-sm border-t border-[#71760d]/10">
      <a
        href="https://mtdtechnologies.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:text-[#71760d] transition-colors"
      >
        chatbot is built by Malik | MTD Technologies
        <ExternalLink className="w-3 h-3" />
      </a>
    </footer>
  );
};
