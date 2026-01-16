import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceType =
  | "bilheteria"
  | "portaria"
  | "estacionamento"
  | "suporte"
  | "bar";

interface ServicesSectionProps {
  selectedServices: ServiceType[];
  onServicesChange: (services: ServiceType[]) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
}

const services: { id: ServiceType; label: string; emoji: string }[] = [
  { id: "bilheteria", label: "BILHETERIA", emoji: "🎫" },
  { id: "portaria", label: "PORTARIA", emoji: "🚪" },
  { id: "estacionamento", label: "ESTACIONAMENTO", emoji: "🚗" },
  { id: "suporte", label: "SUPORTE ONLINE", emoji: "🎧" },
  { id: "bar", label: "BAR", emoji: "🍺" },
];

export function ServicesSection({
  selectedServices,
  onServicesChange,
  description,
  onDescriptionChange,
}: ServicesSectionProps) {
  const toggleService = (serviceId: ServiceType) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter((s) => s !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Ticket className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Serviços Prestados
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {services.map((service) => {
          const isActive = selectedServices.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={cn("service-toggle", isActive && "active")}
            >
              <span>{service.emoji}</span>
              <span>{service.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        <label className="form-label">Descrição Adicional dos Serviços</label>
        <Textarea
          placeholder="Descreva os serviços prestados..."
          className="min-h-[100px] resize-none"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
}
