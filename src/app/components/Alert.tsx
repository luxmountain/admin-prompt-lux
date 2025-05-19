import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface AlertMessageProps {
  type: "default" | "destructive";
  content: string;
}

export default function AlertMessage({ type, content }: AlertMessageProps) {
  return (
    <Alert variant={type} className="fixed bottom-8 right-8 z-50 w-80">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{type === "destructive" ? "Error" : "Success"}</AlertTitle>
      <AlertDescription>{content}</AlertDescription>
    </Alert>
  );
}
