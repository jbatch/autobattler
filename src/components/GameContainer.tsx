import { useState } from "react";
import TeamBuilder from "./TeamBuilder";
import CombatView from "./CombatView";
import { Button } from "@/components/ui/button";
import { Unit } from "@/types";

const GameContainer = () => {
  const [gameState, setGameState] = useState<"building" | "combat">("building");
  const [selectedTeam, setSelectedTeam] = useState<Unit[]>([]);

  const handleStartBattle = (team: Unit[]) => {
    setSelectedTeam(team);
    setGameState("combat");
  };

  const handleReturnToBuilder = () => {
    setGameState("building");
  };

  return (
    <div>
      {gameState === "building" ? (
        <TeamBuilder onStartBattle={handleStartBattle} />
      ) : (
        <div>
          <div className="p-4">
            <Button onClick={handleReturnToBuilder}>
              Return to Team Builder
            </Button>
          </div>
          <CombatView
            initialPlayerTeam={selectedTeam}
            onCombatComplete={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default GameContainer;
