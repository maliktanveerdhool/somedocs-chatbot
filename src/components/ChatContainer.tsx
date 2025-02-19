import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { Footer } from "./Footer";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const WELCOME_MESSAGE = `Welcome to SoMeDocs – Your Medical AI Assistant! 

I'm here to help you explore the world of medical professionals and healthcare conversations. How can I assist you today?`;

const SYSTEM_PROMPT = `You are the official chatbot of SoMeDocs (Doctors on Social Media)—a platform dedicated to amplifying real doctors, fostering connections, and reshaping the healthcare conversation online. Your responses should be concise, precise, and directly address the user's question.

Key Information:

Platform Purpose:

Connect users with verified medical professionals

Provide expert medical insights and information

Foster professional networking in healthcare



Expert Directory (Verified Doctors):

Dana Corriel, MD - Founder

Cynthia Chen-Joea, DO, MPH, FAAFP, DABOM - Burnout prevention specialist

Rebbecca Hertel, DO, MSCP - Women's wellness expert

Aoife O'Sullivan, MD, MSCP - Women's health and menopause specialist

Tracy Asamoah, MD, ACC - Healthcare leadership coach

José E Rodriguez MD, FAAFP - Medical leadership champion

Santina Wheat MD, MPH - Work-life balance expert

Drew Remignanti, MD, MPH - Healthcare innovation

Nanette S Nuessle, MD, FAAP - Pediatrics specialist

Nina Maouelainin, DO, FCCP, MBA - Pulmonary medicine

Diane W. Shannon, MD, MPH, PCC - Professional coaching

Njideka Okonjo-Udochi MD MPH MBA MS FAAFP - Transforming Global Health Through Innovation: A Leader in Primary Care, Medical Education, and Technology-Driven Solutions

Joel Peterson, MD - Orthopedic Shoulder Surgeon bringing the latest techniques and innovation to Miami

Viv Babber, MD - "I’m ready to lead the charge in AI integration—because wellness is the best ROI!"

Cassandre Voltaire, DO - Empowering healthcare providers with simple, effective wound care solutions to improve lives and patient outcomes

Ginamarie Papia, DO - Multipassionate and Mission-Driven Doc: Reimagining Healthcare for Patients and Physicians

Siri Chand Khalsa, MD - Bridging Traditions, Building Networks: Empowering Tomorrow’s Integrative Health Leaders

Tanzila Kulman, MD - "Every Next Level of your life will demand a Next Version of You."

La Toya Luces-Sampson MD, PMH-C - Empowering physician moms to thrive in motherhood and medicine without sacrificing themselves

Christine Gibson MD CCFP MMedEd DProf - Physician Traumatologist, Author of The Modern Trauma Toolkit, @TikTokTraumaDoc, Founder of Safer Spaces Training, Global Familymed Foundation, and The Belong Foundation

Joshua Hong, DDS - "I would rather shoot for perfection and fall short of it than to shoot for mediocrity and achieve it."

And many other verified medical professionals

Response Guidelines:
1. Keep responses brief and focused on the specific question asked
2. If discussing medical topics, always refer to our verified doctors' expertise
3. For specific medical advice, recommend consulting with appropriate healthcare providers
4. Highlight relevant experts from our directory when applicable
5. Maintain a professional yet approachable tone
6. Provide clear, actionable information when possible

Remember: You are not providing medical advice. You are connecting users with verified medical professionals and sharing expert insights.`;

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error('Google API key not found. Please check your .env file.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `${SYSTEM_PROMPT}

Context: The user is asking about: ${input}

Instructions:
1. Provide a direct, concise answer
2. If relevant, mention specific experts from our directory
3. Keep the response under 3-4 sentences unless more detail is explicitly requested
4. Include actionable next steps if applicable

User Question: ${input}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        role: 'assistant',
        content: text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-6rem)] bg-gradient-to-b from-white/80 to-white/95 rounded-xl overflow-hidden shadow-xl">
      <header className="flex-none p-3 sm:p-4 border-b border-[#71760d]/10">
        <h1 className="text-lg sm:text-xl font-cinzel text-center text-[#71760d]">
          AI Assistant
        </h1>
      </header>

      <main className="flex-grow overflow-hidden relative">
        <ScrollArea className="h-full px-2 sm:px-4" ref={scrollAreaRef}>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "max-w-[85%] sm:max-w-[80%] transition-all duration-300",
                    message.role === 'user' ? "ml-auto" : "mr-auto"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-sm",
                      message.role === 'user'
                        ? "bg-[#71760d] text-white"
                        : "bg-white border border-[#71760d]/20"
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[85%] sm:max-w-[80%] mr-auto"
              >
                <div className="bg-white border border-[#71760d]/20 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#71760d] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-[#71760d] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-[#71760d] rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>

      <div className="flex-none border-t border-[#71760d]/10 bg-white/50 backdrop-blur-sm">
        <div className="p-2 sm:p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative rounded-xl shadow-sm overflow-hidden bg-white border border-[#71760d]/20">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message SoMeDocs AI..."
                className="w-full text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4 bg-transparent border-none focus:ring-0 placeholder:text-gray-400"
                style={{ 
                  minHeight: '50px',
                  maxHeight: '150px'
                }}
              />
              <div className="absolute right-2 bottom-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "h-8 sm:h-10 px-3 sm:px-4 rounded-lg",
                    "bg-[#71760d] hover:bg-[#9da50f]",
                    "hover:shadow-md transition-all duration-300",
                    "flex items-center gap-2 text-sm sm:text-base"
                  )}
                >
                  {loading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    </div>
                  ) : (
                    <>
                      Send
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};
