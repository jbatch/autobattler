import { useCombatSystem } from "../hooks/useCombatSystem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Unit } from "@/types";
import { useEffect, useState } from "react";
import CombatVictoryDialog from "./CombatVictoryDialog";

interface CombatViewProps {
  initialPlayerTeam: Unit[];
  onCombatComplete: (victory: boolean) => void;
}

const CombatView = ({
  initialPlayerTeam,
  onCombatComplete,
}: CombatViewProps) => {
  const { combatState, startCombat } = useCombatSystem(initialPlayerTeam);
  const { playerTeam, enemyTeam, logs, isActive } = combatState;
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);

  useEffect(() => {
    if (!isActive && logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      const victory = lastLog.includes("Player Team Wins");

      if (victory) {
        setShowVictoryDialog(true);
      } else {
        onCombatComplete(false);
      }
    }
  }, [isActive, logs, onCombatComplete]);

  const handleVictoryClose = () => {
    setShowVictoryDialog(false);
    onCombatComplete(true);
  };

  const renderUnit = (unit: Unit) => {
    return (
      <Card key={unit.id} className="p-4 m-2">
        <h3 className="font-bold">{unit.name}</h3>

        {/* Health Bar */}
        <div className="text-sm">
          HP: {unit.currentHealth}/{unit.maxHealth}
        </div>
        <motion.div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="bg-green-500 h-full"
            initial={{ width: "100%" }}
            animate={{
              width: `${(unit.currentHealth / unit.maxHealth) * 100}%`,
            }}
          />
        </motion.div>

        <div className="text-sm mt-2">Damage: {unit.damage}</div>
      </Card>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Player Team</h2>
          <div>{playerTeam.map(renderUnit)}</div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Enemy Team</h2>
          <div>{enemyTeam.map(renderUnit)}</div>
        </div>
      </div>

      <div className="text-center mb-4">
        {!isActive && (
          <Button onClick={startCombat} className="px-8">
            Start Combat
          </Button>
        )}
      </div>

      <ScrollArea className="h-48 border rounded-lg p-4">
        <div className="space-y-1">
          {logs.map((log, index) => (
            <p key={index} className="text-sm">
              {log}
            </p>
          ))}
        </div>
      </ScrollArea>

      <CombatVictoryDialog
        isOpen={showVictoryDialog}
        onClose={handleVictoryClose}
      />
    </div>
  );
};

export default CombatView;
