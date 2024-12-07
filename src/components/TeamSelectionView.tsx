import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CombatUnit } from "@/types";
import { createUnit } from "@/data/unit-data";

// Starting team configurations
const STARTING_TEAMS: {
  id: string;
  name: string;
  description: string;
  units: CombatUnit[];
}[] = [
  {
    id: "balanced",
    name: "Balanced Team",
    description: "A well-rounded team with mixed abilities",
    units: [createUnit("knight")],
  },
  {
    id: "aggressive",
    name: "Aggressive Team",
    description: "High damage output but less survivability",
    units: [createUnit("berserker")],
  },
  {
    id: "defensive",
    name: "Defensive Team",
    description: "High survivability but slower damage output",
    units: [createUnit("archer")],
  },
];

interface StartingTeamSelectionProps {
  onTeamSelect: (team: CombatUnit[]) => void;
}

const TeamSelectionView = ({ onTeamSelect }: StartingTeamSelectionProps) => {
  const renderUnitInfo = (unit: CombatUnit) => (
    <div
      key={unit.id}
      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
    >
      <div className="flex-1">
        <div className="font-medium">{unit.name}</div>
        <div className="text-sm text-gray-600">
          HP: {unit.maxHealth} | DMG: {unit.damage}
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
