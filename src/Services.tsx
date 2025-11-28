import { 
  Scissors, 
  Sparkles, 
  Waves, 
  Brush, 
  Users, 
  Child, 
  Sun, 
  Atom, 
  Wand2, 
  Laugh, 
  Flame 
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./button";

interface ServicesProps {
  onBookingClick: () => void;
}

/* =====================
      CATEGORIAS
===================== */

const categories = [
  {
    name: "Cortes",
    icon: Scissors,
    services: [
      { title: "Corte Tradicional", price: "R$ 23,00", duration: "30 min" },
      { title: "Corte Americano", price: "R$ 20,00", duration: "30 min" },
      { title: "Corte Infantil", price: "R$ 25,00", duration: "30 min" },
      { title: "Corte todo na máquina", price: "R$ 20,00", duration: "20 min" },
      { title: "Corte + Luzes", price: "R$ 55,00", duration: "60 min" },
      { title: "Platinado", price: "R$ 70,00", duration: "90 min" },
      { title: "Corte + Pigmentação", price: "R$ 28,00", duration: "40 min" },
    ],
  },

  {
    name: "Barba",
    icon: Waves,
    services: [
      { title: "Barba", price: "R$ 12,00", duration: "20 min" },
      { title: "Barba + Higienização", price: "R$ 15,00", duration: "30 min" },
      { title: "Barba com Pigmento", price: "R$ 18,00", duration: "30 min" },
      { title: "Corte & Barba", price: "R$ 32,00", duration: "50 min" },
    ],
  },

  {
    name: "Premium",
    icon: Sparkles,
    services: [
      { title: "Barboterapia | Vapor Ozônio", price: "R$ 45,00", duration: "40 min" },
      { title: "Limpeza Premium Nariz", price: "R$ 15,00", duration: "15 min" },
      { title: "Limpeza Premium Orelha", price: "R$ 10,00", duration: "15 min" },
      { title: "Alisamento Americano", price: "R$ 35,00", duration: "60 min" },
    ],
  },

  {
    name: "Combos",
    icon: Users,
    services: [
      { title: "Combo Pai e Filho", price: "R$ 40,00", duration: "50 min" },
      { title: "Combo Três Amigos", price: "R$ 60,00", duration: "70 min" },
    ],
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
            Serviços profissionais, premium e acessíveis para todos os estilos.
          </p>
        </motion.div>

        {/* CATEGORIES */}
        <div className="space-y-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              {/* Category Title */}
              <div className="flex items-center gap-3 mb-8">
                <cat.icon className="w-8 h-8 text-[#C9A961]" />
                <h3 className="text-3xl text-white font-semibold">{cat.name}</h3>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#C9A961] transition-all duration-300"
                  >
                    <h4 className="text-xl text-white mb-4">{service.title}</h4>

                    <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                      <p className="text-2xl text-[#C9A961]">{service.price}</p>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
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

