import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Users } from "lucide-react";

interface EventViewProps {
  gold: number;
  onComplete: (result: {
    goldChange?: number;
    teamSizeIncrease?: number;
  }) => void;
}

const EventView = ({ gold, onComplete }: EventViewProps) => {
  const [stage, setStage] = useState<"choice" | "gambling">("choice");
  const [isFlipping, setIsFlipping] = useState(false);

  const GAMBLE_AMOUNT = 100;
  const REWARD_AMOUNT = 250;

  const handleGamble = async () => {
    if (gold < GAMBLE_AMOUNT) return;

    setIsFlipping(true);

    // Artificial delay for suspense
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const won = Math.random() > 0.5;
    setIsFlipping(false);

    onComplete({
      goldChange: won ? REWARD_AMOUNT : -GAMBLE_AMOUNT,
    });
  };

  const handleTeamSize = () => {
    onComplete({
      teamSizeIncrease: 1,
    });
  };

  if (stage === "gambling") {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-yellow-500" />
              Flip a Coin
            </CardTitle>
            <CardDescription>
              Bet {GAMBLE_AMOUNT} gold for a chance to win {REWARD_AMOUNT} gold!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div
              className={`transition-transform duration-500 ${
                isFlipping ? "animate-spin" : ""
              }`}
            >
              <Coins className="h-24 w-24 text-yellow-500" />
            </div>
            <div className="text-center space-y-2">
              <p>Win: +{REWARD_AMOUNT} gold</p>
              <p>Lose: -{GAMBLE_AMOUNT} gold</p>
            </div>
            <Button
              className="w-48"
              onClick={handleGamble}
              disabled={isFlipping || gold < GAMBLE_AMOUNT}
            >
              {isFlipping ? "Flipping..." : "Flip Coin"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Mysterious Stranger</CardTitle>
          <CardDescription>
            A hooded figure approaches with an interesting proposition...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="p-6 cursor-pointer hover:bg-gray-50 transition-all"
              onClick={() => setStage("gambling")}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <Coins className="h-12 w-12 text-yellow-500" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Gamble</h3>
                  <p className="text-gray-600">
                    Bet {GAMBLE_AMOUNT} gold on a coin flip.
                    <br />
                    Win {REWARD_AMOUNT} or lose your bet.
                  </p>
                </div>
                <Button className="w-full" disabled={gold < GAMBLE_AMOUNT}>
                  {gold < GAMBLE_AMOUNT ? "Not Enough Gold" : "Try Your Luck"}
                </Button>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:bg-gray-50 transition-all"
              onClick={handleTeamSize}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <Users className="h-12 w-12 text-blue-500" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Expand Team</h3>
                  <p className="text-gray-600">
                    Increase your maximum team size by 1 permanently.
                  </p>
                </div>
                <Button className="w-full">Accept Training</Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventView;
