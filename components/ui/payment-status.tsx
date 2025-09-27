import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface PaymentStatusProps {
  status: "pending" | "paid" | "failed";
  amount?: number;
  reference?: string;
  paidAt?: Date;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  amount,
  reference,
  paidAt,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "paid":
        return {
          icon: CheckCircle,
          label: "Paid",
          variant: "default" as const,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          variant: "secondary" as const,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "failed":
        return {
          icon: XCircle,
          label: "Failed",
          variant: "destructive" as const,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: AlertCircle,
          label: "Unknown",
          variant: "outline" as const,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center gap-3">
        <IconComponent className={`w-5 h-5 ${config.color}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="text-xs">
              {config.label}
            </Badge>
            {amount && (
              <span className="text-sm font-medium">
                NGN {amount.toLocaleString()}
              </span>
            )}
          </div>
          {reference && (
            <p className="text-xs text-gray-600 mt-1">
              Ref: {reference}
            </p>
          )}
          {paidAt && status === "paid" && (
            <p className="text-xs text-gray-600 mt-1">
              Paid on {new Date(paidAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;


