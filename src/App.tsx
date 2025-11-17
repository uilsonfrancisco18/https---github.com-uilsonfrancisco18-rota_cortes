import { useState } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Services } from "./Services";
import { Gallery } from "./Gallery";
import { Barbers } from "./Barbers";
import { Testimonials } from "./Testimonials";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <Header onBookingClick={() => setIsBookingOpen(true)} />
      <Hero onBookingClick={() => setIsBookingOpen(true)} />
      <Services onBookingClick={() => setIsBookingOpen(true)} />
      <Gallery />
      <Barbers />
      <Testimonials />
      <Contact />
      <Footer />
      <BookingModal 
        open={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}
