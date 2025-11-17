import { Scissors, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#2A2A2A]">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-8 h-8 text-[#C9A961]" />
              <span className="text-2xl text-white">BarberShop</span>
            </div>
            <p className="text-gray-400 mb-4">
              Estilo e tradição em cada corte. Transformando sua imagem com excelência desde 2013.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C9A961]/20 p-3 rounded-full hover:bg-[#C9A961] transition-colors group"
              >
                <Instagram className="w-5 h-5 text-[#C9A961] group-hover:text-black transition-colors" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C9A961]/20 p-3 rounded-full hover:bg-[#C9A961] transition-colors group"
              >
                <Facebook className="w-5 h-5 text-[#C9A961] group-hover:text-black transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-[#C9A961] transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-[#C9A961] transition-colors"
                >
                  Serviços
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-[#C9A961] transition-colors"
                >
                  Galeria
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("barbers")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-[#C9A961] transition-colors"
                >
                  Barbeiros
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-gray-400 hover:text-[#C9A961] transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Corte Tradicional</li>
              <li>Corte + Barba</li>
              <li>Barboterapia</li>
              <li>Platinado/Coloração</li>
              <li>Design de Sobrancelhas</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                <span>Rua da Consolação, 1234<br />Centro - São Paulo, SP</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-5 h-5 text-[#C9A961] flex-shrink-0" />
                <a href="tel:+5511999999999" className="hover:text-[#C9A961] transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-5 h-5 text-[#C9A961] flex-shrink-0" />
                <a href="mailto:contato@barbershop.com" className="hover:text-[#C9A961] transition-colors">
                  contato@barbershop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2A2A2A] text-center text-gray-400">
          <p>
            © {currentYear} BarberShop. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
