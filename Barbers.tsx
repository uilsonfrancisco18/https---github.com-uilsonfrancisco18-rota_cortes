import { motion } from "motion/react";
import { Instagram, Award } from "lucide-react";

const barbers = [
  {
    name: "Roberto Silva",
    role: "Master Barber",
    experience: "12 anos de experiência",
    specialty: "Especialista em degradê",
    instagram: "@roberto_barber",
  },
  {
    name: "Carlos Mendes",
    role: "Barber Sênior",
    experience: "8 anos de experiência",
    specialty: "Especialista em barboterapia",
    instagram: "@carlos_barber",
  },
  {
    name: "Felipe Santos",
    role: "Barber",
    experience: "5 anos de experiência",
    specialty: "Especialista em coloração",
    instagram: "@felipe_barber",
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
            Nossa Equipe
          </span>
          <h2 className="text-4xl lg:text-5xl mt-4 mb-6 text-white">
            Mestres da <span className="text-[#C9A961]">Barbearia</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Profissionais qualificados e apaixonados por entregar o melhor serviço.
          </p>
        </motion.div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* Image Placeholder */}
              <div className="relative overflow-hidden rounded-lg mb-6 aspect-[3/4] bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-24 h-24 text-[#C9A961]/20" />
                </div>
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