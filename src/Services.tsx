import { Scissors, Sparkles, Waves, Brush } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./button";

interface ServicesProps {
  onBookingClick: () => void;
}

const services = [
  {
    icon: Scissors,
    title: "Corte Tradicional",
    description: "Corte clássico com acabamento perfeito, utilizando técnicas tradicionais e modernas.",
    price: "R$ 23,00",
    duration: "30 min",
  },
  {
    icon: Sparkles,
    title: "Corte + Barba",
    description: "Combo completo com corte de cabelo e barba, para um visual totalmente renovado.",
    price: "R$ 32,00",
    duration: "45 min",
  },
  {
    icon: Waves,
    title: "Barboterapia",
    description: "Tratamento premium para barba incluindo hidratação, modelagem e finalização.",
    price: "R$ 45,00",
    duration: "45 min",
  },
  {
    icon: Brush,
    title: "Platinado/Coloração",
    description: "Coloração e platinado profissional com produtos de alta qualidade.",
    price: "R$ 70,00",
    duration: "90 min",
  },
];

export function Services({ onBookingClick }: ServicesProps) {
  return (
    <section id="services" className="py-20 lg:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C9A961] uppercase tracking-wider">
            Nossos Serviços
          </span>
          <h2 className="text-4xl lg:text-5xl mt-4 mb-6 text-white">
            Experiências Que <span className="text-[#C9A961]">Transformam</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Oferecemos serviços premium de barbearia com profissionais experientes e produtos de alta qualidade.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#C9A961] transition-all duration-300 group"
            >
              <div className="bg-[#C9A961]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#C9A961]/20 transition-colors">
                <service.icon className="w-8 h-8 text-[#C9A961]" />
              </div>
              
              <h3 className="text-xl mb-3 text-white">
                {service.title}
              </h3>
              
              <p className="text-gray-400 mb-6">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                <div>
                  <p className="text-2xl text-[#C9A961]">{service.price}</p>
                  <p className="text-sm text-gray-500">{service.duration}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={onBookingClick}
            size="lg"
            className="bg-[#C9A961] hover:bg-[#B89951] text-black text-lg px-8"
          >
            Agendar Serviço
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
