// financial_analysis.js

document.addEventListener("DOMContentLoaded", function() {
    // Get references to input elements
    const systemCostInput = document.getElementById("system-cost");
    const incentiveInput = document.getElementById("incentive");
    const energyRateInput = document.getElementById("energy-rate");
    const annualProductionInput = document.getElementById("annual-production");
    const calculateButton = document.getElementById("calculate-financial");

    // Set default values for the inputs
    systemCostInput.value = 15000;
    incentiveInput.value = 3000;
    energyRateInput.value = 0.25;
    annualProductionInput.value = 8000;

    // Get references to output elements
    const totalInvestmentOutput = document.getElementById("total-investment");
    const annualSavingsOutput = document.getElementById("annual-savings");
    const paybackPeriodOutput = document.getElementById("payback-period");
    const roiOutput = document.getElementById("roi");

    // Event listener for calculate button
    calculateButton.addEventListener("click", function() {
        // Parse input values
        const systemCost = parseFloat(systemCostInput.value);
        const incentive = parseFloat(incentiveInput.value);
        const energyRate = parseFloat(energyRateInput.value);
        const annualProduction = parseFloat(annualProductionInput.value);

        // Validate inputs
        if (isNaN(systemCost) || isNaN(incentive) || isNaN(energyRate) || isNaN(annualProduction)) {
            alert("Please enter valid numbers for all inputs.");
            return;
        }

        // Calculate financial metrics
        const totalInvestment = systemCost - incentive;
        const annualSavings = annualProduction * energyRate;
        const paybackPeriod = totalInvestment / annualSavings;
        const roi = ((annualSavings / totalInvestment) * 100).toFixed(2);

        // Display results
        totalInvestmentOutput.textContent = `Total Investment Cost: $${totalInvestment.toFixed(2)}`;
        annualSavingsOutput.textContent = `Annual Savings: $${annualSavings.toFixed(2)}`;
        paybackPeriodOutput.textContent = `Payback Period: ${paybackPeriod.toFixed(2)} years`;
        roiOutput.textContent = `Return on Investment (ROI): ${roi}%`;
    });

    // Chart.js integration for financial visualizations
    const ctxPaybackChart = document.getElementById("paybackChart").getContext("2d");
    let paybackChart;

    function updatePaybackChart(totalInvestment, annualSavings, paybackPeriod) {
        const cumulativeSavings = [];
        for (let year = 0; year <= Math.ceil(paybackPeriod); year++) {
            cumulativeSavings.push(year * annualSavings);
        }

        // If chart already exists, destroy it to prevent duplication issues
        if (paybackChart) {
            paybackChart.destroy();
        }

        // Create a new chart
        paybackChart = new Chart(ctxPaybackChart, {
            type: 'line',
            data: {
                labels: Array.from({ length: cumulativeSavings.length }, (_, i) => `Year ${i}`),
                datasets: [{
                    label: 'Cumulative Savings ($)',
                    data: cumulativeSavings,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    borderWidth: 2
                }, {
                    label: 'Total Investment ($)',
                    data: Array(cumulativeSavings.length).fill(totalInvestment),
                    borderColor: '#e74c3c',
                    borderDash: [5, 5],
                    fill: false,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Dollars ($)'
                        }
                    }
                }
            }
        });
    }

    // Event listener to update chart when calculate button is clicked
    calculateButton.addEventListener("click", function() {
        const systemCost = parseFloat(systemCostInput.value);
        const incentive = parseFloat(incentiveInput.value);
        const energyRate = parseFloat(energyRateInput.value);
        const annualProduction = parseFloat(annualProductionInput.value);

        if (!isNaN(systemCost) && !isNaN(incentive) && !isNaN(energyRate) && !isNaN(annualProduction)) {
            const totalInvestment = systemCost - incentive;
            const annualSavings = annualProduction * energyRate;
            const paybackPeriod = totalInvestment / annualSavings;

            // Update the payback chart
            updatePaybackChart(totalInvestment, annualSavings, paybackPeriod);
        }
    });
});
