import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Calendar } from "./calendar";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Scissors } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const services = [
  { id: "traditional", name: "Corte Tradicional", price: "R$ 45" },
  { id: "combo", name: "Corte + Barba", price: "R$ 70" },
  { id: "barbotherapy", name: "Barboterapia", price: "R$ 50" },
  { id: "coloring", name: "Platinado/Coloração", price: "R$ 120" },
];

const barbers = [
  { id: "roberto", name: "Roberto Silva" },
  { id: "carlos", name: "Carlos Mendes" },
  { id: "felipe", name: "Felipe Santos" },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30",
];

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const booking = {
      service: services.find(s => s.id === selectedService)?.name,
      barber: barbers.find(b => b.id === selectedBarber)?.name,
      date: selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "",
      time: selectedTime,
      name,
      phone,
      email,
    };

    alert(`Agendamento confirmado!\n\nServiço: ${booking.service}\nBarbeiro: ${booking.barber}\nData: ${booking.date}\nHorário: ${booking.time}\nCliente: ${booking.name}`);
    
    // Reset form
    setStep(1);
    setSelectedDate(undefined);
    setSelectedService("");
    setSelectedBarber("");
    setSelectedTime("");
    setName("");
    setPhone("");
    setEmail("");
    onClose();
  };

  const canProceedStep1 = selectedService && selectedBarber;
  const canProceedStep2 = selectedDate && selectedTime;
  const canSubmit = name && phone && email;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#1A1A1A] border-[#2A2A2A] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-white">
            Agendar Horário
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step >= s
                    ? "bg-[#C9A961] text-black"
                    : "bg-[#2A2A2A] text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step > s ? "bg-[#C9A961]" : "bg-[#2A2A2A]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service and Barber */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="service" className="flex items-center gap-2 text-white">
                  <Scissors className="w-4 h-4 text-[#C9A961]" />
                  Escolha o Serviço
                </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    {services.map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id}
                        className="text-white focus:bg-[#2A2A2A] focus:text-white"
                      >
                        {service.name} - {service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barber" className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-[#C9A961]" />
                  Escolha o Barbeiro
                </Label>
                <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#2A2A2A] text-white">
                    <SelectValue placeholder="Selecione um barbeiro" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                    {barbers.map((barber) => (
                      <SelectItem
                        key={barber.id}
                        value={barber.id}
                        className="text-white focus:bg-[#2A2A2A] focus:text-white"
                      >
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full bg-[#C9A961] hover:bg-[#B89951] text-black"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Step 2: Date and Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-white">
                  <CalendarIcon className="w-4 h-4 text-[#C9A961]" />
                  Escolha a Data
                </Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  locale={ptBR}
                  className="rounded-md border border-[#2A2A2A] bg-[#0A0A0A] text-white"
                />
              </div>

              {selectedDate && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 text-[#C9A961]" />
                    Escolha o Horário
                  </Label>
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded border transition-colors ${
                          selectedTime === time
                            ? "bg-[#C9A961] text-black border-[#C9A961]"
                            : "bg-[#0A0A0A] text-white border-[#2A2A2A] hover:border-[#C9A961]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="flex-1 bg-[#C9A961] hover:bg-[#B89951] text-black"
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Personal Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-[#C9A961]" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4 text-[#C9A961]" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-white">
                  <Mail className="w-4 h-4 text-[#C9A961]" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0A0A0A] border-[#2A2A2A] text-white"
                />
              </div>

              {/* Summary */}
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-400">Resumo do Agendamento:</p>
                <p className="text-white">
                  {services.find(s => s.id === selectedService)?.name} com{" "}
                  {barbers.find(b => b.id === selectedBarber)?.name}
                </p>
                <p className="text-white">
                  {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às {selectedTime}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 bg-[#C9A961] hover:bg-[#B89951] text-black"
                >
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
