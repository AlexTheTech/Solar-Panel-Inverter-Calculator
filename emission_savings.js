// emission_savings.js

document.addEventListener("DOMContentLoaded", function() {
    // Get references to input and output elements
    const annualProductionInput = document.getElementById("annual-production");
    const emissionFactorInput = document.getElementById("emission-factor");
    const calculateButton = document.getElementById("calculate-emission");
    const annualCO2SavingsOutput = document.getElementById("annual-co2-savings");
    const equivalentTreesOutput = document.getElementById("equivalent-trees");

    // Event listener for calculate button
    calculateButton.addEventListener("click", function() {
        // Parse input values
        const annualProduction = parseFloat(annualProductionInput.value);
        const emissionFactor = parseFloat(emissionFactorInput.value);

        // Validate inputs
        if (isNaN(annualProduction) || annualProduction <= 0 || isNaN(emissionFactor) || emissionFactor < 0) {
            alert("Please enter valid positive numbers for both annual energy production and emission factor.");
            return;
        }

        // Calculate annual CO2 savings
        const annualCO2Savings = annualProduction * emissionFactor;

        // Calculate equivalent trees planted
        // Assumption: 1 tree absorbs approximately 21.77 kg of CO2 per year
        const CO2AbsorptionPerTree = 21.77;
        const equivalentTrees = annualCO2Savings / CO2AbsorptionPerTree;

        // Display result
        annualCO2SavingsOutput.textContent = `Annual CO₂ Savings (kg): ${annualCO2Savings.toFixed(2)}`;
        equivalentTreesOutput.textContent = `Equivalent Trees Planted: ${equivalentTrees.toFixed(2)}`;
    });
});
