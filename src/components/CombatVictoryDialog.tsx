import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface CombatVictoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CombatVictoryDialog = ({ isOpen, onClose }: CombatVictoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Victory!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-center text-gray-600">
            Your team emerged victorious in battle!
          </div>
          {/* Future reward display would go here */}
          <Button className="w-40" onClick={onClose}>
            Return to Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CombatVictoryDialog;
