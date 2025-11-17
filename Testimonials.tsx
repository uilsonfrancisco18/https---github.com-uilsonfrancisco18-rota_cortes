import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "João Pedro",
    role: "Cliente há 2 anos",
    rating: 5,
    text: "Melhor barbearia da região! Atendimento impecável e profissionais muito qualificados. Sempre saio satisfeito.",
  },
  {
    name: "Marcos Lima",
    role: "Cliente há 1 ano",
    rating: 5,
    text: "Ambiente incrível, música boa e o corte sempre fica perfeito. Já indiquei para vários amigos.",
  },
  {
    name: "Rafael Costa",
    role: "Cliente há 3 anos",
    rating: 5,
    text: "Frequento desde a inauguração e nunca me decepcionei. A equipe é sensacional e o resultado sempre supera as expectativas.",
  },
  {
    name: "André Santos",
    role: "Cliente há 6 meses",
    rating: 5,
    text: "Descobri por acaso e virou minha barbearia de confiança. Profissionalismo e qualidade em cada detalhe.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-black">
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
            Depoimentos
          </span>
          <h2 className="text-4xl lg:text-5xl mt-4 mb-6 text-white">
            O Que Dizem Nossos <span className="text-[#C9A961]">Clientes</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A satisfação dos nossos clientes é nossa maior conquista.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 hover:border-[#C9A961] transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-[#C9A961]/30" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#C9A961] text-[#C9A961]"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6">"{testimonial.text}"</p>

              {/* Author */}
              <div className="pt-4 border-t border-[#2A2A2A]">
                <p className="text-white mb-1">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-[#2A2A2A]"
        >
          <div className="text-center">
            <p className="text-4xl lg:text-5xl text-[#C9A961] mb-2">500+</p>
            <p className="text-gray-400">Clientes Satisfeitos</p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl text-[#C9A961] mb-2">12</p>
            <p className="text-gray-400">Anos de Experiência</p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl text-[#C9A961] mb-2">5.0</p>
            <p className="text-gray-400">Avaliação Média</p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl text-[#C9A961] mb-2">3</p>
            <p className="text-gray-400">Barbeiros Profissionais</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}