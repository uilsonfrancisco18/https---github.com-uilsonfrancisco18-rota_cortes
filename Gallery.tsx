import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1547648946-2b1fd7eab923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBjdXR0aW5nJTIwaGFpcnxlbnwxfHx8fDE3NjMzMTc3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Corte de cabelo profissional",
  },
  {
    url: "https://images.unsplash.com/photo-1599447068894-089fabc9876c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFyZCUyMGdyb29taW5nfGVufDF8fHx8MTc2MzM2OTY3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Barboterapia",
  },
  {
    url: "https://images.unsplash.com/photo-1656921350183-7935040cf7fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjB0b29scyUyMHNjaXNzb3JzfGVufDF8fHx8MTc2MzMyNTMxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Ferramentas profissionais",
  },
  {
    url: "https://images.unsplash.com/photo-1630254688956-40da9f30216a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwaGFpcmN1dCUyMHN0eWxlfGVufDF8fHx8MTc2MzM3NDY0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Estilo moderno",
  },
  {
    url: "https://images.unsplash.com/photo-1702865262133-c10351acc1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBzaG9wJTIwY2hhaXJ8ZW58MXx8fHwxNzYzMzc0NjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Interior da barbearia",
  },
  {
    url: "https://images.unsplash.com/photo-1754294437661-129b86f868ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXJzaG9wJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzYzMjgxNTQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    alt: "Ambiente moderno",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20 lg:py-32 bg-black">
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
            Galeria
          </span>
          <h2 className="text-4xl lg:text-5xl mt-4 mb-6 text-white">
            Nossos <span className="text-[#C9A961]">Trabalhos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Veja alguns dos nossos melhores trabalhos e o ambiente da nossa barbearia.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}