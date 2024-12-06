import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Sword, Crosshair } from "lucide-react";
import type { Unit } from "@/types";

// Starting team configurations
const STARTING_TEAMS: {
  id: string;
  name: string;
  description: string;
  units: Unit[];
}[] = [
  {
    id: "balanced",
    name: "Balanced Team",
    description: "A well-rounded team with mixed abilities",
    units: [
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
    ],
  },
  {
    id: "aggressive",
    name: "Aggressive Team",
    description: "High damage output but less survivability",
    units: [
      {
        id: "berserker",
        name: "Berserker",
        maxHealth: 80,
        currentHealth: 80,
        damage: 35,
        cooldown: 3,
        currentCooldown: 3,
        position: "frontline",
      },
      {
        id: "assassin",
        name: "Assassin",
        maxHealth: 60,
        currentHealth: 60,
        damage: 40,
        cooldown: 4,
        currentCooldown: 4,
        position: "backline",
      },
      {
        id: "mage",
        name: "Mage",
        maxHealth: 50,
        currentHealth: 50,
        damage: 45,
        cooldown: 5,
        currentCooldown: 5,
        position: "support",
      },
    ],
  },
  {
    id: "defensive",
    name: "Defensive Team",
    description: "High survivability but slower damage output",
    units: [
      {
        id: "guardian",
        name: "Guardian",
        maxHealth: 120,
        currentHealth: 120,
        damage: 15,
        cooldown: 3,
        currentCooldown: 3,
        position: "frontline",
      },
      {
        id: "paladin",
        name: "Paladin",
        maxHealth: 100,
        currentHealth: 100,
        damage: 20,
        cooldown: 4,
        currentCooldown: 4,
        position: "frontline",
      },
      {
        id: "priest",
        name: "Priest",
        maxHealth: 70,
        currentHealth: 70,
        damage: 10,
        cooldown: 2,
        currentCooldown: 2,
        position: "support",
      },
    ],
  },
];

interface StartingTeamSelectionProps {
  onTeamSelect: (team: Unit[]) => void;
}

const TeamSelectionView = ({ onTeamSelect }: StartingTeamSelectionProps) => {
  const getPositionIcon = (position: string) => {
    switch (position) {
      case "frontline":
        return <Shield className="w-4 h-4" />;
      case "backline":
        return <Crosshair className="w-4 h-4" />;
      case "support":
        return <Sword className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderUnitInfo = (unit: Unit) => (
    <div
      key={unit.id}
      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
    >
      <div className="text-blue-500">{getPositionIcon(unit.position)}</div>
      <div className="flex-1">
        <div className="font-medium">{unit.name}</div>
        <div className="text-sm text-gray-600">
          HP: {unit.maxHealth} | DMG: {unit.damage} | SPD: {unit.cooldown}s
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Starting Team</h1>
        <p className="text-gray-600">Select a team to begin your adventure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STARTING_TEAMS.map((team) => (
          <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2">{team.name}</h2>
            <p className="text-gray-600 mb-4">{team.description}</p>

            <div className="space-y-2 mb-6">
              {team.units.map(renderUnitInfo)}
            </div>

            <Button className="w-full" onClick={() => onTeamSelect(team.units)}>
              Select {team.name}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamSelectionView;
