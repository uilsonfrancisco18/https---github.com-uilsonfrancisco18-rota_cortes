import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";


import { Calendar } from "./calendar";


import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Scissors,
} from "lucide-react";


import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}


// TODOS OS SERVIÇOS
const services = [
  { id: "limpeza-nariz", name: "Limpeza Premium Nariz", price: "R$ 10,00" },
  { id: "limpeza-orelhas", name: "Limpeza Premium Orelhas", price: "R$ 10,00" },
  { id: "corte-barba-32", name: "Corte & Barba", price: "R$ 32,00" },
  { id: "corte-23", name: "Corte", price: "R$ 23,00" },
  { id: "barba-higienizacao", name: "Barba + Higienização", price: "R$ 15,00" },
  { id: "barba-12", name: "Barba", price: "R$ 12,00" },
  { id: "corte-infantil", name: "Corte Infantil", price: "R$ 25,00" },
  { id: "combo-pai-filho", name: "Combo Pai e Filho", price: "R$ 40,00" },
  { id: "combo-3-amigos", name: "Combo 3 Amigos", price: "R$ 60,00" },
  { id: "corte-americano", name: "Corte Americano", price: "R$ 20,00" },
  { id: "corte-todo-maquina", name: "Corte Todo Máquina", price: "R$ 20,00" },
  { id: "barboterapia-ozonio", name: "Barboterapia | Vapor Ozônio", price: "R$ 45,00" },
  { id: "sobrancelha-navalha", name: "Sobrancelha Navalha", price: "R$ 10,00" },
  { id: "corte-luzes", name: "Corte + Luzes", price: "R$ 55,00" },
  { id: "platinado", name: "Platinado", price: "R$ 70,00" },
  { id: "corte-pigmentacao", name: "Corte + Pigmentação", price: "R$ 28,00" },
  { id: "barba-pigmento", name: "Barba com Pigmento", price: "R$ 18,00" },
  { id: "alisamento-americano", name: "Alisamento Americano", price: "R$ 35,00" },
];


// DURAÇÃO EM MINUTOS POR SERVIÇO (usa o name como chave)
const serviceDurations: Record<string, number> = {
  "Limpeza Premium Nariz": 15,
  "Limpeza Premium Orelhas": 15,
  "Corte & Barba": 45,
  "Corte": 30,
  "Barba + Higienização": 20,
  "Barba": 20,
  "Corte Infantil": 30,
  "Combo Pai e Filho": 50,
  "Combo 3 Amigos": 90,
  "Corte Americano": 30,
  "Corte Todo Máquina": 20,
  "Barboterapia | Vapor Ozônio": 45,
  "Sobrancelha Navalha": 10,
  "Corte + Luzes": 60,
  "Platinado": 90,
  "Corte + Pigmentação": 30,
  "Barba com Pigmento": 20,
  "Alisamento Americano": 35,
};


// HORÁRIOS DE 30 EM 30 (sem almoço 12h–14h)
const ALL_SLOTS = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  // almoço fora
  "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];


type Booking = {
  dateKey: string;  // "2025-12-02"
  start: string;    // "08:00"
  duration: number; // em minutos
};


export function BookingModal({ open, onClose }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");


  const [bookings, setBookings] = useState<Booking[]>([]);


  const blockedDates = [
    new Date(2025, 10, 29),
    new Date(2025, 10, 30),
  ];


  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };


  const isOverlapping = (
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ) => startA < endB && startB < endA;


  const getBlockedSlotsForDate = (dateKey: string) => {
    const dayBookings = bookings.filter((b) => b.dateKey === dateKey);
    const blocked = new Set<string>();


    for (const b of dayBookings) {
      const start = timeToMinutes(b.start);
      const end = start + b.duration;


      for (const slot of ALL_SLOTS) {
        const s = timeToMinutes(slot);
        const e = s + 30;
        if (isOverlapping(start, end, s, e)) {
          blocked.add(slot);
        }
      }
    }


    return blocked;
  };


  const filteredHours = (() => {
    if (!date || date.getDay() === 0 || !selectedService) return [];


    const dateKey = date.toISOString().slice(0, 10);
    const blockedByBookings = getBlockedSlotsForDate(dateKey);


    return ALL_SLOTS.filter((slot) => !blockedByBookings.has(slot));
  })();


  function handleConfirm() {
    if (!selectedService || !date || !time || !name || !phone) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }


    const duration = serviceDurations[selectedService] ?? 30;


    const dateKey = date.toISOString().slice(0, 10);
    const start = timeToMinutes(time);
    const end = start + duration;


    const dayBookings = bookings.filter((b) => b.dateKey === dateKey);
    const hasOverlap = dayBookings.some((b) => {
      const bStart = timeToMinutes(b.start);
      const bEnd = bStart + b.duration;
      return isOverlapping(start, end, bStart, bEnd);
    });


    if (hasOverlap) {
      alert("Esse horário já está ocupado para a duração do serviço escolhido.");
      return;
    }


    const formatted = {
      service: selectedService,
      date: format(date, "dd/MM/yyyy", { locale: ptBR }),
      time,
      name,
      phone,
      email,
    };


    console.log("Agendamento confirmado:", formatted);


    setBookings((prev) => [
      ...prev,
      { dateKey, start: time, duration },
    ]);


    onClose();
  }


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Scissors size={20} />
            Agendar Horário
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-5">
          {/* Serviço - CÓDIGO ATUALIZADO */}
          <div>
            <Label>Serviço</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger
                className={[
                  "mt-1 bg-[#101010] text-white rounded-lg",
                  "h-12 px-4 text-sm sm:text-base",
                  "border border-[#2A2A2A]",
                  selectedService && "border-[#C9A961] border-2",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent className="bg-[#101010] text-white max-h-72">
                {services.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.name}
                    className="hover:bg-[#2A2A2A]"
                  >
                    {service.name} — {service.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {/* Data - CÓDIGO ATUALIZADO E CENTRALIZADO */}
          <div className="flex justify-center">
            <div className="rdp-root w-full max-w-sm" data-mode="single">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center text-white">
                Selecionar Data
              </h2>
              <Calendar
                selected={date}
                onSelect={(d) => setDate(d)}
                className="rounded-xl border border-[#2A2A2A] bg-[#101010] p-4 shadow-xl"
                classNames={{
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-white",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_icon: "h-4 w-4 text-white",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-zinc-400 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-zinc-900/50 [&:has([aria-selected])]:bg-[#C9A961]",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white",
                  day_selected: "bg-[#C9A961] text-black hover:bg-[#B89951] focus:bg-[#B89951]",
                  day_today: "bg-[#2A2A2A] text-white",
                  day_outside: "day-outside text-zinc-500 opacity-50 aria-selected:bg-zinc-800/50 aria-selected:text-zinc-400 aria-selected:opacity-30",
                  day_disabled: "text-zinc-500 opacity-50",
                  day_range_middle: "aria-selected:bg-zinc-800 aria-selected:text-white",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>


          {/* Horário */}
          <div>
            <Label>Horário</Label>


            {date?.getDay() === 0 && (
              <p className="text-red-400 text-sm mb-2">
                Domingo — a barbearia não abre.
              </p>
            )}


            <div className="flex items-center gap-2 border border-[#2A2A2A] bg-[#101010] p-2 rounded-md">
              <Clock size={18} />


              <Select
                value={time}
                onValueChange={setTime}
                disabled={filteredHours.length === 0 || !selectedService}
              >
                <SelectTrigger className="bg-[#101010] border-none text-white">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>


                <SelectContent className="bg-[#101010] text-white border border-[#2A2A2A]">
                  {filteredHours.map((hour) => (
                    <SelectItem
                      key={hour}
                      value={hour}
                      className="hover:bg-[#2A2A2A]"
                    >
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Almoço: 12h às 14h (indisponível).
            </p>
          </div>


          {/* Nome */}
          <div>
            <Label>Nome</Label>
            <div className="flex items-center gap-2 border border-[#2A2A2A] bg-[#101010] rounded-md p-2">
              <User size={18} />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="bg-transparent border-none text-white"
              />
            </div>
          </div>


          {/* Telefone */}
          <div>
            <Label>Telefone</Label>
            <div className="flex items-center gap-2 border border-[#2A2A2A] bg-[#101010] rounded-md p-2">
              <Phone size={18} />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="bg-transparent border-none text-white"
              />
            </div>
          </div>


          {/* Email */}
          <div>
            <Label>Email (opcional)</Label>
            <div className="flex items-center gap-2 border border-[#2A2A2A] bg-[#101010] rounded-md p-2">
              <Mail size={18} />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-transparent border-none text-white"
              />
            </div>
          </div>


          {/* Confirmar */}
          <Button
            onClick={handleConfirm}
            className="w-full bg-[#C9A961] hover:bg-[#B89951] text-black font-semibold"
          >
            Confirmar Agendamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


