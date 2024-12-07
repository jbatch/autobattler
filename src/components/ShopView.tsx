import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Unit } from "@/types";
import { Store, X } from "lucide-react";

interface ShopViewProps {
  gold: number;
  playerTeam: Unit[];
  maxTeamSize: number;
  onClose: () => void;
  onBuyUnit: (unit: Unit) => void;
  onDismissUnit: (unitId: string) => void;
}

const SHOP_UNITS: Unit[] = [
  {
    id: "shop-knight",
    name: "Knight",
    maxHealth: 100,
    currentHealth: 100,
    damage: 20,
  },
  {
    id: "shop-archer",
    name: "Archer",
    maxHealth: 70,
    currentHealth: 70,
    damage: 30,
  },
  {
    id: "shop-mage",
    name: "Mage",
    maxHealth: 50,
    currentHealth: 50,
    damage: 40,
  },
  {
    id: "shop-cleric",
    name: "Cleric",
    maxHealth: 60,
    currentHealth: 60,
    damage: 15,
  },
  {
    id: "shop-berserker",
    name: "Berserker",
    maxHealth: 80,
    currentHealth: 80,
    damage: 35,
  },
];

const UNIT_COSTS = {
  Knight: 100,
  Archer: 120,
  Mage: 150,
  Cleric: 130,
  Berserker: 140,
};

const ShopView = ({
  gold,
  playerTeam,
  maxTeamSize,
  onClose,
  onBuyUnit,
  onDismissUnit,
}: ShopViewProps) => {
  const canAddUnit = playerTeam.length < maxTeamSize;

  const renderUnitCard = (
    unit: Unit,
    cost: number,
    isShopUnit: boolean = false
  ) => (
    <Card key={unit.id} className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{unit.name}</span>
          {isShopUnit ? (
            <span className="text-yellow-600">{cost} Gold</span>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => onDismissUnit(unit.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>HP:</span>
            <span>{unit.maxHealth}</span>
          </div>
          <div className="flex justify-between">
            <span>DMG:</span>
            <span>{unit.damage}</span>
          </div>
        </div>
      </CardContent>
      {isShopUnit && (
        <CardFooter>
          <Button
            className="w-full"
            disabled={!canAddUnit || gold < cost}
            onClick={() => onBuyUnit(unit)}
          >
            {!canAddUnit
              ? "Team Full"
              : gold < cost
              ? "Not Enough Gold"
              : "Buy Unit"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              Merchant's Shop
            </CardTitle>
            <div className="flex items-center gap-4">
              <span className="text-yellow-600 font-bold">{gold} Gold</span>
              <Button variant="outline" onClick={onClose}>
                Leave Shop
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shop Units */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Units</h3>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-4">
                {SHOP_UNITS.map((unit) =>
                  renderUnitCard(
                    unit,
                    UNIT_COSTS[unit.name as keyof typeof UNIT_COSTS],
                    true
                  )
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Player Team */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Your Team ({playerTeam.length}/{maxTeamSize})
            </h3>
            <div className="space-y-4">
              {playerTeam.length === 0 ? (
                <p className="text-gray-500 italic">No units in team</p>
              ) : (
                playerTeam.map((unit) => renderUnitCard(unit, 0))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopView;
