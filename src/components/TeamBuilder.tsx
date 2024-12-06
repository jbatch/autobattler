import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Sword, Crosshair } from "lucide-react";
import { Unit } from "@/types";

// Available positions for units
const POSITIONS = {
  frontline: { icon: Shield, label: "Frontline" },
  backline: { icon: Crosshair, label: "Backline" },
  support: { icon: Sword, label: "Support" },
} as const;

// Sample roster of available units
const AVAILABLE_UNITS: Unit[] = [
  {
    id: "knight",
    name: "Knight",
    maxHealth: 100,
    currentHealth: 100,
    damage: 20,
    cooldown: 3,
    currentCooldown: 3,
    position: "frontline",
  },
  {
    id: "archer",
    name: "Archer",
    maxHealth: 70,
    currentHealth: 70,
    damage: 30,
    cooldown: 4,
    currentCooldown: 4,
    position: "backline",
  },
  {
    id: "cleric",
    name: "Cleric",
    maxHealth: 60,
    currentHealth: 60,
    damage: 15,
    cooldown: 2,
    currentCooldown: 2,
    position: "support",
  },
  {
    id: "warrior",
    name: "Warrior",
    maxHealth: 90,
    currentHealth: 90,
    damage: 25,
    cooldown: 3,
    currentCooldown: 3,
    position: "frontline",
  },
  {
    id: "mage",
    name: "Mage",
    maxHealth: 50,
    currentHealth: 50,
    damage: 40,
    cooldown: 5,
    currentCooldown: 5,
    position: "backline",
  },
];

// Sample upcoming enemy team
const ENEMY_TEAM: Unit[] = [
  {
    id: "e1",
    name: "Goblin Chief",
    maxHealth: 120,
    currentHealth: 120,
    damage: 25,
    cooldown: 3,
    currentCooldown: 3,
    position: "frontline",
  },
  {
    id: "e2",
    name: "Goblin Archer",
    maxHealth: 60,
    currentHealth: 60,
    damage: 35,
    cooldown: 4,
    currentCooldown: 4,
    position: "backline",
  },
];

interface TeamBuilderProps {
  onStartBattle: (playerTeam: Unit[]) => void;
}

const TeamBuilder = ({ onStartBattle }: TeamBuilderProps) => {
  const [selectedTeam, setSelectedTeam] = useState<Unit[]>([]);

  const handleUnitClick = (unit: Unit) => {
    // Check if unit is already in team
    if (selectedTeam.some((teamUnit) => teamUnit.id === unit.id)) {
      setSelectedTeam(
        selectedTeam.filter((teamUnit) => teamUnit.id !== unit.id)
      );
    } else if (selectedTeam.length < 3) {
      // Limit team size
      setSelectedTeam([
        ...selectedTeam,
        { ...unit, currentHealth: unit.maxHealth },
      ]);
    }
  };

  const renderUnitCard = (unit: Unit, isSelected: boolean) => {
    const PositionIcon = POSITIONS[unit.position].icon;

    return (
      <Card
        key={unit.id}
        className={`p-4 cursor-pointer transition-all ${
          isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
        }`}
        onClick={() => handleUnitClick(unit)}
      >
        <div className="flex items-center gap-2 mb-2">
          <PositionIcon className="w-4 h-4" />
          <h3 className="font-bold">{unit.name}</h3>
        </div>
        <div className="space-y-1 text-sm">
          <div>HP: {unit.maxHealth}</div>
          <div>DMG: {unit.damage}</div>
          <div>Speed: {unit.cooldown}s</div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* Unit Roster */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4">Available Units</h2>
          <div className="grid grid-cols-3 gap-4">
            {AVAILABLE_UNITS.map((unit) =>
              renderUnitCard(
                unit,
                selectedTeam.some((teamUnit) => teamUnit.id === unit.id)
              )
            )}
          </div>
        </div>

        {/* Team Preview and Enemy Info */}
        <div className="space-y-6">
          {/* Selected Team */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Your Team ({selectedTeam.length}/3)
            </h2>
            <div className="space-y-4">
              {selectedTeam.length === 0 ? (
                <p className="text-gray-500 italic">
                  Select units to build your team
                </p>
              ) : (
                selectedTeam.map((unit) => renderUnitCard(unit, true))
              )}
            </div>
          </div>

          {/* Upcoming Enemy Team */}
          <div>
            <h2 className="text-xl font-bold mb-4">Upcoming Enemy Team</h2>
            <ScrollArea className="h-48">
              <div className="space-y-4">
                {ENEMY_TEAM.map((unit) => (
                  <Card key={unit.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold">{unit.name}</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>HP: {unit.maxHealth}</div>
                      <div>DMG: {unit.damage}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Battle Button */}
          <Button
            className="w-full"
            disabled={selectedTeam.length === 0}
            onClick={() => onStartBattle(selectedTeam)}
          >
            Start Battle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
