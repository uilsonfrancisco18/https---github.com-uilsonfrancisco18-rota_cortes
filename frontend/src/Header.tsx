import { useState, useEffect } from "react";
import { Button } from "./button";
import { Scissors, Menu, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onBookingClick: () => void;
  onMyAppointmentsClick: () => void;
}

export function Header({ onBookingClick, onMyAppointmentsClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "home", label: "Início" },
    { id: "services", label: "Serviços" },
    { id: "gallery", label: "Galeria" },
    { id: "barbers", label: "Barbeiros" },
    { id: "testimonials", label: "Depoimentos" },
    { id: "contact", label: "Contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <Scissors className="w-8 h-8 text-[#C9A961]" />
            <span className="text-2xl text-white">Barbearia Aliança</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-[#C9A961] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={onMyAppointmentsClick}
              className="bg-[#C9A961] hover:bg-[#B89951] text-black font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Meus Agendamentos
            </Button>
            <Button
              onClick={onBookingClick}
              variant="outline"
              className="border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961] hover:text-black"
            >
              Agendar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/98 backdrop-blur-md border-t border-[#2A2A2A]"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-[#C9A961] transition-colors text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  onMyAppointmentsClick();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-[#C9A961] hover:bg-[#B89951] text-black w-full mt-2 font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Meus Agendamentos
              </Button>
              <Button
                onClick={() => {
                  onBookingClick();
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961] hover:text-black w-full"
              >
                Agendar Agora
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}