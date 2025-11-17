import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Button } from "./button";

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-[#0A0A0A]">
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
            Contato
          </span>
          <h2 className="text-4xl lg:text-5xl mt-4 mb-6 text-white">
            Visite Nossa <span className="text-[#C9A961]">Barbearia</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Estamos prontos para atender você. Entre em contato ou venha nos visitar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="bg-[#C9A961]/20 p-4 rounded-full">
                <MapPin className="w-6 h-6 text-[#C9A961]" />
              </div>
              <div>
                <h3 className="text-xl mb-2 text-white">Endereço</h3>
                <p className="text-gray-400">
                  Rua da Consolação, 1234<br />
                  Centro - São Paulo, SP<br />
                  CEP: 01301-100
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-[#C9A961]/20 p-4 rounded-full">
                <Phone className="w-6 h-6 text-[#C9A961]" />
              </div>
              <div>
                <h3 className="text-xl mb-2 text-white">Telefone</h3>
                <p className="text-gray-400">
                  <a href="tel:+5511999999999" className="hover:text-[#C9A961] transition-colors">
                    (11) 99999-9999
                  </a>
                  <br />
                  <a href="tel:+5511999999998" className="hover:text-[#C9A961] transition-colors">
                    (11) 99999-9998
                  </a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#C9A961]/20 p-4 rounded-full">
                <Mail className="w-6 h-6 text-[#C9A961]" />
              </div>
              <div>
                <h3 className="text-xl mb-2 text-white">E-mail</h3>
                <p className="text-gray-400">
                  <a href="mailto:contato@barbershop.com" className="hover:text-[#C9A961] transition-colors">
                    contato@barbershop.com
                  </a>
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="bg-[#C9A961]/20 p-4 rounded-full">
                <Clock className="w-6 h-6 text-[#C9A961]" />
              </div>
              <div>
                <h3 className="text-xl mb-2 text-white">Horário de Funcionamento</h3>
                <p className="text-gray-400">
                  Segunda a Sexta: 8h00 - 18h00<br />
                  Sábado: 8h00 - 16h00<br />
                  Domingo: Fechado
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl mb-4 text-white">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C9A961]/20 p-4 rounded-full hover:bg-[#C9A961] transition-colors group"
                >
                  <Instagram className="w-6 h-6 text-[#C9A961] group-hover:text-black transition-colors" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C9A961]/20 p-4 rounded-full hover:bg-[#C9A961] transition-colors group"
                >
                  <Facebook className="w-6 h-6 text-[#C9A961] group-hover:text-black transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-lg overflow-hidden h-[500px] bg-[#1A1A1A] border border-[#2A2A2A]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1972783583607!2d-46.65886368502205!3d-23.561684984683654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1sen!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização BarberShop"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
