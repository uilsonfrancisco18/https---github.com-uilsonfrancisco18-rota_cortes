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
import { MyAppointments } from "./MyAppointments";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  // Carregar userId do localStorage quando o app inicia
  const handleMyAppointmentsClick = () => {
    const id = localStorage.getItem("userId");
    setUserId(id || undefined);
    setIsMyAppointmentsOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onBookingClick={() => setIsBookingOpen(true)}
        onMyAppointmentsClick={handleMyAppointmentsClick}
      />
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
      <MyAppointments
        open={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        userId={userId}
      />
    </div>
  );
}
