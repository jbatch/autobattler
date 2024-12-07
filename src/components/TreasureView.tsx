import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Coins, ArrowUp } from "lucide-react";
import type { CombatUnit } from "@/types";
import { unitTemplates } from "@/data/unit-data";

interface TreasureViewProps {
  playerTeam: CombatUnit[];
  onComplete: (upgradedTeam?: CombatUnit[]) => void;
}

const TreasureView = ({ playerTeam, onComplete }: TreasureViewProps) => {
  console.log();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [showingUpgradeChoice, setShowingUpgradeChoice] = useState(false);

  // Constants for rewards
  const GOLD_REWARD = 200;

  const handleGoldChoice = () => {
    onComplete(); // No team changes, just gold will be added in GameView
  };

  const handleUpgradeChoice = () => {
    setShowingUpgradeChoice(true);
  };

  const getUpgradedUnit = (id: string) => {
    const unit = playerTeam.find((u) => u.id === id)!;
    return {
      ...unit,
      level: unit.level + 1,
      maxHealth:
        unit.maxHealth +
        (unitTemplates[unit.templateId].statsPerLevel.maxHealth ?? 0),
      currentHealth:
        unit.currentHealth +
        (unitTemplates[unit.templateId].statsPerLevel.maxHealth ?? 0),
      damage:
        unit.damage +
        (unitTemplates[unit.templateId].statsPerLevel.damage ?? 0),
    } as CombatUnit;
  };

  const handleUnitUpgrade = () => {
    if (!selectedUnitId) return;

    const upgradedTeam = playerTeam.map((unit) => {
      if (unit.id === selectedUnitId) {
        return getUpgradedUnit(selectedUnitId)!;
      }
      return unit;
    });

    onComplete(upgradedTeam);
  };

  if (showingUpgradeChoice) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="h-6 w-6 text-green-500" />
              Choose Unit to Upgrade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {playerTeam.map((unit) => {
                const previewUpgrade = getUpgradedUnit(unit.id);
                return (
                  <Card
                    key={unit.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedUnitId === unit.id
                        ? "ring-2 ring-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedUnitId(unit.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{unit.name}</h3>
                        <div className="text-sm text-gray-600">
                          HP: {unit.maxHealth} → {previewUpgrade?.maxHealth}
                          <br />
                          DMG: {unit.damage} → {previewUpgrade?.damage}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <Button
                className="mt-4"
                disabled={!selectedUnitId}
                onClick={handleUnitUpgrade}
              >
                Upgrade Unit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-purple-500" />
            Treasure Found!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-6 cursor-pointer hover:bg-gray-50 transition-all"
              onClick={handleGoldChoice}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <Coins className="h-12 w-12 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Gold Reward</h3>
                  <p className="text-yellow-600 font-bold text-2xl">
                    {GOLD_REWARD} Gold
                  </p>
                </div>
                <Button className="w-full">Take Gold</Button>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:bg-gray-50 transition-all"
              onClick={handleUpgradeChoice}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <ArrowUp className="h-12 w-12 text-green-500" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Upgrade Unit</h3>
                  <p className="text-gray-600">
                    HP++
                    <br /> DMG++
                  </p>
                </div>
                <Button className="w-full">Choose Unit</Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasureView;
