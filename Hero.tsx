import { Button } from "./button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HeroProps {
  onBookingClick: () => void;
}

export function Hero({ onBookingClick }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1754294437661-129b86f868ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzYzMjgxNTQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Barbearia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-[#C9A961]/20 border border-[#C9A961] text-[#C9A961] rounded-full mb-6">
              Estilo e Tradição
            </span>
            
            <h1 className="text-5xl lg:text-7xl mb-6 text-white">
              O ESTILO É UM REFLEXO DA SUA{" "}
              <span className="text-[#C9A961]">PERSONALIDADE</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Mais do que um corte de cabelo, oferecemos uma experiência única de cuidado e estilo masculino. Reserve seu horário e descubra o poder de um visual impecável.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={onBookingClick}
                size="lg"
                className="bg-[#C9A961] hover:bg-[#B89951] text-black text-lg px-8 py-6 transform hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Meu Corte
              </Button>
              <Button
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 transition-all"
              >
                Ver Serviços
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="bg-[#C9A961]/20 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-[#C9A961]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Horário</p>
                  <p className="text-white">Seg-Sáb: 8h-18h</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="bg-[#C9A961]/20 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-[#C9A961]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Localização</p>
                  <p className="text-white">Centro, São Paulo</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="bg-[#C9A961]/20 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-[#C9A961]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Agendamento</p>
                  <p className="text-white">Online 24/7</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white text-sm">Role para baixo</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-[#C9A961] rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}