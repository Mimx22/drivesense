/**
 * Smart Fuel Engine - Adaptive Logic for DriveSense
 * Supports Dual Mode: Distance-to-Fuel and Fuel-to-Distance
 * Factors in Traffic and AC usage for realistic results.
 */
export const smartFuelEngine = ({
  mode, // "distance" or "fuel"
  distance,
  litres,
  fuelPrice,
  kmPerLitre,
  traffic,
  acOn
}) => {

  // 🔧 Traffic factors
  const trafficFactors = {
    low: 1,
    medium: 0.9,
    high: 0.75
  };

  // 🔧 AC factor (5% efficiency loss)
  const acFactor = acOn ? 0.95 : 1;

  // 🔧 Adjusted efficiency based on real-world conditions
  const adjustedEfficiency = kmPerLitre * trafficFactors[traffic] * acFactor;

  let fuelUsed = 0;
  let finalDistance = 0;

  // 🚀 Mode 1: Distance ➜ Fuel
  // We have a target distance, how much fuel will we need?
  if (mode === "distance") {
    fuelUsed = distance / adjustedEfficiency;
    finalDistance = distance;
  }

  // 🚀 Mode 2: Fuel ➜ Distance
  // We have fixed fuel, how far can we go?
  if (mode === "fuel") {
    fuelUsed = litres;
    finalDistance = litres * adjustedEfficiency;
  }

  // 💰 Cost estimation
  const totalCost = fuelUsed * fuelPrice;

  return {
    fuelUsed: Number(fuelUsed.toFixed(2)),
    distance: Number(finalDistance.toFixed(2)),
    cost: Number(totalCost.toFixed(2)),
    efficiency: Number(adjustedEfficiency.toFixed(2))
  };
};
