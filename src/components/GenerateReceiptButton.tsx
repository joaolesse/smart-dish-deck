import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface GenerateReceiptButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function GenerateReceiptButton({ onClick, disabled }: GenerateReceiptButtonProps) {
  return (
    <div className="flex justify-center pt-6">
      <Button
        onClick={onClick}
        disabled={disabled}
        size="lg"
        className="px-8 py-6 text-base font-semibold gap-2"
      >
        <FileText className="h-5 w-5" />
        Gerar Recibo
      </Button>
    </div>
  );
}
