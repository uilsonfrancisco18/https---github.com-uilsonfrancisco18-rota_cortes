import { motion } from "motion/react";
import { Instagram } from "lucide-react"; // Award removido daqui

const barbers = [
  {
    name: "Valdeir Gomes",
    role: "Master Barber",
    experience: "10 anos de experiência",
    specialty: "Especialista em cortes, barba e coloração",
    instagram: "@valblackoficial",
  },
];

export function Barbers() {
  return (
    <section id="barbers" className="py-20 lg:py-32 bg-[#0A0A0A]">
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
            Nosso Barbeiro
          </span>
          <h2 className="text-4xl lg:text-5xl mt-4 mb-6 text-white">
            Profissional <span className="text-[#C9A961]">Especializado</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Atendimento premium com qualidade, experiência e dedicação.
          </p>
        </motion.div>

        {/* Barber Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-xl mx-auto">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* Imagem do Barbeiro - Substituindo o Placeholder do Award */}
              <div className="relative overflow-hidden rounded-lg mb-6 aspect-[3/4] bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
                
                {/* NOVO: A tag <img> com o caminho para a sua imagem salva em public/ */}
                <img
                    src="/rota-barbearia-promo.jpeg"
                    alt={`Foto de ${barber.name} e Rota Barbearia`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* O gradiente é mantido para que o Social Overlay fique visível */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Social Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <a
                    href={`https://instagram.com/${barber.instagram.substring(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white hover:text-[#C9A961] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>{barber.instagram}</span>
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-2xl mb-1 text-white">{barber.name}</h3>
                <p className="text-[#C9A961] mb-3">{barber.role}</p>
                <p className="text-gray-400 text-sm mb-2">{barber.experience}</p>
                <p className="text-gray-500 text-sm">{barber.specialty}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}