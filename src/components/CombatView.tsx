import { useCombatSystem } from "../hooks/useCombatSystem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { type Unit } from "../hooks/useCombatSystem";

const CombatView = () => {
  const { combatState, startCombat } = useCombatSystem();
  const { playerTeam, enemyTeam, logs, isActive } = combatState;

  const renderUnit = (unit: Unit) => {
    // Calculate progress as a repeating animation
    const progressAnimation = {
      scaleX: [0, 1],
      transition: {
        duration: unit.cooldown,
        ease: "linear",
        repeat: Infinity,
        // Reset the animation when cooldown resets
        key: `${unit.id}-${unit.currentCooldown}`,
      },
    };

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
            // transition={{ type: "spring", damping: 100 }}
          />
        </motion.div>

        {/* Cooldown Bar */}
        <div className="text-sm mt-3">Attack in: {unit.currentCooldown}</div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-1 overflow-hidden">
          <motion.div
            className="bg-blue-500 h-full origin-left"
            animate={isActive ? progressAnimation : ""}
          />
        </div>

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
    </div>
  );
};

export default CombatView;
