import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { brazilStates } from "@/data/brazilStates";
import { User, Calendar } from "lucide-react";

export interface ReceiptInfo {
  nomeCompleto: string;
  cpf: string;
  produtor: string;
  nomeEvento: string;
  tipoData: "unico" | "periodo";
  dataEvento: string;
  dataEventoFim: string;
  estadoEvento: string;
  cidadeEvento: string;
  pix: string;
  dataRecibo: string;
  estadoRecibo: string;
  cidadeRecibo: string;
}

interface ReceiptInfoFormProps {
  data: ReceiptInfo;
  onChange: (data: ReceiptInfo) => void;
}

export function ReceiptInfoForm({ data, onChange }: ReceiptInfoFormProps) {
  const updateField = (field: keyof ReceiptInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Informações do Recibo
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="form-label">
            Nome Completo <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="João da Silva"
            value={data.nomeCompleto}
            onChange={(e) => updateField("nomeCompleto", e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">CPF</label>
          <Input
            placeholder="123.456.789-00"
            value={data.cpf}
            onChange={(e) => updateField("cpf", e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Produtor</label>
          <Input
            placeholder="Nome do Produtor"
            value={data.produtor}
            onChange={(e) => updateField("produtor", e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Nome do Evento</label>
          <Input
            placeholder="Nome do Evento"
            value={data.nomeEvento}
            onChange={(e) => updateField("nomeEvento", e.target.value)}
          />
        </div>

        {/* Tipo de Data */}
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="form-label flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tipo de Data do Evento
          </label>
          <RadioGroup
            value={data.tipoData}
            onValueChange={(value) => updateField("tipoData", value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unico" id="unico" />
              <Label htmlFor="unico" className="cursor-pointer">
                Dia Único
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="periodo" id="periodo" />
              <Label htmlFor="periodo" className="cursor-pointer">
                Período (de/até)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <label className="form-label">
            {data.tipoData === "periodo" ? "Data Início" : "Data do Evento"}
          </label>
          <Input
            type="date"
            value={data.dataEvento}
            onChange={(e) => updateField("dataEvento", e.target.value)}
          />
        </div>

        {data.tipoData === "periodo" && (
          <div>
            <label className="form-label">Data Fim</label>
            <Input
              type="date"
              value={data.dataEventoFim}
              onChange={(e) => updateField("dataEventoFim", e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="form-label">Estado</label>
          <Select
            value={data.estadoEvento}
            onValueChange={(value) => updateField("estadoEvento", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="form-label">Cidade</label>
          <Input
            placeholder="Cidade do evento"
            value={data.cidadeEvento}
            onChange={(e) => updateField("cidadeEvento", e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">PIX (Opcional)</label>
          <Input
            placeholder="Chave PIX ou CPF"
            value={data.pix}
            onChange={(e) => updateField("pix", e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Data do Recibo</label>
          <Input
            type="date"
            value={data.dataRecibo}
            onChange={(e) => updateField("dataRecibo", e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Estado do Recibo</label>
          <Select
            value={data.estadoRecibo}
            onValueChange={(value) => updateField("estadoRecibo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="form-label">Cidade do Recibo</label>
          <Input
            placeholder="Cidade do recibo"
            value={data.cidadeRecibo}
            onChange={(e) => updateField("cidadeRecibo", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
