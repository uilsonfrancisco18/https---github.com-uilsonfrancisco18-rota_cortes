import { useState, useEffect } from "react";
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

	// Persist bookings in localStorage so agendamentos sobrevivem reloads
	useEffect(() => {
		// Try to load bookings from backend first; fallback to localStorage
		const load = async () => {
			try {
				const res = await fetch('/api/appointments/public');
				if (res.ok) {
					const data = await res.json();
					// data: [{ date: ..., duration: number }, ...]
					const parsed: Booking[] = data.map((a: any) => {
						const dt = new Date(a.date);
						const dateKey = dt.toISOString().slice(0, 10);
						const hh = dt.getHours().toString().padStart(2, '0');
						const mm = dt.getMinutes().toString().padStart(2, '0');
						return { dateKey, start: `${hh}:${mm}`, duration: a.duration } as Booking;
					});
					setBookings(parsed);
					return;
				}
			} catch (e) {
				// ignore, fallback
			}

			try {
				const raw = localStorage.getItem("vb_bookings");
				if (raw) {
					const parsed = JSON.parse(raw) as Booking[];
					setBookings(parsed);
				}
			} catch (e) {
				console.warn("Não foi possível ler bookings do localStorage", e);
			}
		};

		load();
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem("vb_bookings", JSON.stringify(bookings));
		} catch (e) {
			console.warn("Não foi possível salvar bookings no localStorage", e);
		}
	}, [bookings]);


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

	// retorna as datas que estão totalmente bloqueadas (todos os slots ocupados)
	const getFullyBlockedDates = (): string[] => {
		const dates = Array.from(new Set(bookings.map((b) => b.dateKey)));
		const fully: string[] = [];
		for (const dKey of dates) {
			const blocked = getBlockedSlotsForDate(dKey);
			if (blocked.size >= ALL_SLOTS.length) fully.push(dKey);
		}
		return fully;
	};


	const filteredHours = (() => {
		if (!date || date.getDay() === 0 || !selectedService) return [];


		const dateKey = date.toISOString().slice(0, 10);
		const blockedByBookings = getBlockedSlotsForDate(dateKey);


		return ALL_SLOTS.filter((slot) => !blockedByBookings.has(slot));
	})();

	const noHoursMessage = () => {
		if (!date) return null;
		if (date.getDay() === 0) return "Domingo — a barbearia não abre.";
		if (!selectedService) return "Selecione um serviço para ver horários.";
		if (filteredHours.length === 0) return "Nenhum horário disponível nesta data.";
		return null;
	};


	const getDurationFromServiceId = (id: string) => {
		const s = services.find((x) => x.id === id);
		if (!s) return 30;
		return serviceDurations[s.name] ?? 30;
	};

	async function handleConfirm() {
    if (!selectedService || !date || !time || !name || !phone) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }


	const duration = getDurationFromServiceId(selectedService);


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


		// Try to persist to backend; if fails, fallback to localOnly
		try {
			const payload = {
				date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(time.split(":")[0]), Number(time.split(":")[1])).toISOString(),
				serviceId: selectedService,
				name,
				phone,
				email,
			};

			const res = await fetch('/api/appointments/public', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const text = await res.text();
				console.warn('Backend booking failed:', res.status, text);
				// fallback to local
				setBookings((prev) => [...prev, { dateKey, start: time, duration }]);
				onClose();
				return;
			}

			// success
			const created = await res.json();
			// created.date is ISO
			const dt = new Date(created.date);
			const hh = dt.getHours().toString().padStart(2, '0');
			const mm = dt.getMinutes().toString().padStart(2, '0');
			
			// Salvar userId no localStorage para acesso posterior
			if (created.userId) {
				localStorage.setItem("userId", created.userId);
				localStorage.setItem("userEmail", email);
				localStorage.setItem("userName", name);
			}
			
			setBookings((prev) => [...prev, { dateKey, start: `${hh}:${mm}`, duration }]);
			
			// Mostrar mensagem de sucesso
			alert("Agendamento realizado com sucesso! Você pode acompanhar em 'Meus Agendamentos'.");
			onClose();
			return;
		} catch (e) {
			console.warn('Erro ao persistir no backend, usando fallback local', e);
			setBookings((prev) => [...prev, { dateKey, start: time, duration }]);
			onClose();
			return;
		}
  }

	// (dev helper removed) bookings now persisted to backend when possible


  return (
    <Dialog open={open} onOpenChange={onClose}>
	<DialogContent className="max-w-4xl w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white max-h-[85vh] overflow-hidden mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Scissors size={20} />
            Agendar Horário
          </DialogTitle>
        </DialogHeader>


	<div className="space-y-5 max-h-[72vh] overflow-auto px-4 py-3">
          {/* Serviço - CÓDIGO ATUALIZADO */}
					<div>
						<Label>Serviço</Label>
						<div className="grid grid-cols-1 gap-2 mt-2 max-h-[300px] md:max-h-[420px] overflow-y-auto pr-2">
							{services.map((service) => {
								const active = selectedService === service.id;
								return (
									<button
										key={service.id}
										type="button"
										onClick={() => setSelectedService(service.id)}
										className={[
											"w-full text-left px-3 py-2 rounded-md border",
											active ? "border-[#C9A961] bg-[#1b1b1b]" : "border-[#2A2A2A] bg-[#101010]",
										].join(" ")}
									>
										<div className="flex items-center justify-between">
											<div>
												<div className="text-sm font-medium">{service.name}</div>
												<div className="text-xs text-zinc-400">{service.price}</div>
											</div>
											<div className="text-xs text-zinc-300">{getDurationFromServiceId(service.id)} min</div>
										</div>
									</button>
								);
							})}
						</div>
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
								blockedDates={getFullyBlockedDates()}
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label>Horário</Label>
							{date?.getDay() === 0 && (
								<p className="text-red-400 text-sm mb-2">Domingo — a barbearia não abre.</p>
							)}
							<div className="mt-2 h-[180px] md:h-[240px] overflow-y-auto rounded-md border border-[#2A2A2A] p-2 bg-[#101010]">
								<div className="grid grid-cols-2 gap-2">
									{ALL_SLOTS.map((slot) => {
										const disabled = filteredHours.indexOf(slot) === -1;
										return (
											<button
												key={slot}
												type="button"
												onClick={() => !disabled && setTime(slot)}
												disabled={disabled}
												className={[
													"w-full py-2 rounded-md text-sm",
													disabled ? "bg-transparent text-zinc-500 border border-transparent cursor-not-allowed" : (time === slot ? "bg-[#C9A961] text-black" : "bg-[#0f0f0f] text-white hover:bg-[#222]")
												].join(" ")}
											>
												{slot}
											</button>
										);
									})}
								</div>
							</div>
							<p className="text-xs text-zinc-400 mt-1">Almoço: 12h às 14h (indisponível).</p>
							{noHoursMessage() && <p className="text-sm text-yellow-300 mt-2">{noHoursMessage()}</p>}
						</div>

						<div className="col-span-1 md:col-span-1">
							<Label>Resumo</Label>
							<div className="mt-2 p-3 rounded-md border border-[#2A2A2A] bg-[#0f0f0f] text-sm">
								<div className="mb-2"><strong>Serviço:</strong> {selectedService ? (services.find(s => s.id === selectedService)?.name) : '—'}</div>
								<div className="mb-2"><strong>Data:</strong> {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : '—'}</div>
								<div className="mb-2"><strong>Horário:</strong> {time || '—'}</div>
								<div className="mb-2"><strong>Duração:</strong> {selectedService ? `${getDurationFromServiceId(selectedService)} min` : '—'}</div>
							</div>
						</div>
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
					{/* removed dev clear button - bookings persisted to backend when possible */}
        </div>
      </DialogContent>
    </Dialog>
  );
}


