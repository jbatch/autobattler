import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CombatUnit } from "@/types";
import { Store, X } from "lucide-react";
import { unitTemplates, createUnit } from "@/data/unit-data";

interface ShopViewProps {
  gold: number;
  playerTeam: CombatUnit[];
  maxTeamSize: number;
  level: number;
  onClose: () => void;
  onBuyUnit: (unit: CombatUnit) => void;
  onDismissUnit: (unitId: string) => void;
}

const ShopView = ({
  gold,
  playerTeam,
  maxTeamSize,
  level,
  onClose,
  onBuyUnit,
  onDismissUnit,
}: ShopViewProps) => {
  const canAddUnit = playerTeam.length < maxTeamSize;

  // Filter available units based on floor level
  const availableUnits = Object.values(unitTemplates).filter(
    (template) => !template.minFloor || template.minFloor <= level
  );

  const renderUnitCard = (
    unit: CombatUnit | null,
    shopTemplate?: (typeof unitTemplates)[keyof typeof unitTemplates]
  ) => {
    if (!unit && !shopTemplate) return null;

    const isShopUnit = !!shopTemplate;
    const displayUnit = unit || createUnit(shopTemplate!.id);
    const cost = shopTemplate?.shopData?.cost || 0;

    return (
      <Card key={displayUnit.id} className="relative">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{displayUnit.name}</span>
            {isShopUnit ? (
              <span className="text-yellow-600">{cost} Gold</span>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => onDismissUnit(displayUnit.id)}
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
              <span>{displayUnit.maxHealth}</span>
            </div>
            <div className="flex justify-between">
              <span>DMG:</span>
              <span>{displayUnit.damage}</span>
            </div>
          </div>
        </CardContent>
        {isShopUnit && (
          <CardFooter>
            <Button
              className="w-full"
              disabled={!canAddUnit || gold < cost}
              onClick={() => onBuyUnit(displayUnit)}
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
  };

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
                {availableUnits.map((template) =>
                  renderUnitCard(null, template)
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
                playerTeam.map((unit) => renderUnitCard(unit))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopView;
