import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Card } from "./card";
import { Calendar, Clock, DollarSign, Trash2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  date: string;
  status: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

interface MyAppointmentsProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function MyAppointments({ open, onClose, userId }: MyAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && userId) {
      fetchAppointments();
    }
  }, [open, userId]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("Você precisa estar logado para ver seus agendamentos.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/appointments/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar agendamentos");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar agendamentos"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    if (!window.confirm("Deseja cancelar este agendamento?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao cancelar agendamento");
      }

      setAppointments(
        appointments.filter((apt) => apt.id !== appointmentId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao cancelar agendamento"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Meus Agendamentos
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A961] mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando agendamentos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Nenhum agendamento encontrado.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Clique em "Agendar Agora" para marcar seu corte!
              </p>
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const appointmentDate = new Date(appointment.date);
                const isUpcoming = appointmentDate > new Date();

                return (
                  <Card
                    key={appointment.id}
                    className={`p-4 border-l-4 ${
                      isUpcoming
                        ? "border-l-[#C9A961] bg-amber-50"
                        : "border-l-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {appointment.service.name}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#C9A961]" />
                            <span>
                              {format(appointmentDate, "EEEE, dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#C9A961]" />
                            <span>
                              {format(appointmentDate, "HH:mm")} (
                              {appointment.service.duration} min)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#C9A961]" />
                            <span className="font-semibold">
                              R$ {appointment.service.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              appointment.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {appointment.status === "CONFIRMED"
                              ? "Confirmado"
                              : appointment.status === "CANCELLED"
                              ? "Cancelado"
                              : "Agendado"}
                          </span>
                        </div>
                      </div>

                      {isUpcoming && appointment.status !== "CANCELLED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={fetchAppointments}
            variant="outline"
            className="flex-1"
          >
            Atualizar
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-[#C9A961] hover:bg-[#B89951] text-black"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
