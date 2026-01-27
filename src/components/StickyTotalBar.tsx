import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";

interface StickyTotalBarProps {
  total: number;
  onGenerate: () => void;
  onPreview?: () => void;
  showPreviewButton?: boolean;
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function StickyTotalBar({ 
  total, 
  onGenerate, 
  onPreview,
  showPreviewButton = false 
}: StickyTotalBarProps) {
  return (
    <div className="sticky-footer">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
              Total
            </span>
            <span className="total-display">
              R$ {formatCurrency(total)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {showPreviewButton && onPreview && (
              <Button 
                variant="outline" 
                onClick={onPreview}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Prévia</span>
              </Button>
            )}
            <Button 
              onClick={onGenerate}
              className="btn-gradient gap-2 px-6"
              size="lg"
            >
              <FileText className="h-5 w-5" />
              <span>Gerar Recibo</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
