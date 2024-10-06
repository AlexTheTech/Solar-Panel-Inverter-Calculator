// solar_graphs_calculation.js

document.getElementById("calculate-button").addEventListener("click", () => {
    // Get User Inputs
    const targetEnergyProduction = parseFloat(document.getElementById("energy-production").value);
    const panelType = document.getElementById("panel-type").value;
    const tiltOption = document.getElementById("tilt-option").value;

    if (isNaN(targetEnergyProduction) || targetEnergyProduction <= 0) {
        alert("Please enter a valid energy production value.");
        return;
    }

    // Mock Data for Calculation Purposes (Replace with Actual Data/Calculations)
    const monthlyInsolation = [6.67, 5.94, 4.53, 3.17, 2.11, 1.69, 1.82, 2.58, 3.45, 4.28, 5.89, 6.53];
    const averagePanelOutput = {
        SLX170: 1.12,
        SLX175: 1.15,
        SLX180: 1.19
    };
    const systemEfficiency = [82, 80, 79, 76, 74, 73, 72, 75, 77, 78, 81, 82];

    // Calculate Results
    const panelDailyOutput = averagePanelOutput[panelType];
    const numberOfPanels = Math.ceil(targetEnergyProduction / (panelDailyOutput * 365));
    const invertersRequired = Math.ceil((numberOfPanels * panelDailyOutput) / 2.8);

    // Display Results
    document.getElementById("panels-required").textContent = `Number of Panels Required: ${numberOfPanels}`;
    document.getElementById("inverters-required").textContent = `Number of Inverters Required: ${invertersRequired}`;
    document.getElementById("estimated-power").textContent = `Average Daily Power Production per Panel: ${(panelDailyOutput).toFixed(2)} kWh`;

    // Generate Charts
    generateDailyEnergyProductionChart(monthlyInsolation, panelDailyOutput);
    generateMonthlyEnergyProductionChart(monthlyInsolation, numberOfPanels, panelDailyOutput);
    generateSystemEfficiencyChart(systemEfficiency);
    generatePanelComparisonChart(averagePanelOutput);
});

function generateDailyEnergyProductionChart(monthlyInsolation, panelDailyOutput) {
    const ctx = document.getElementById("dailyEnergyProductionChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "Daily Energy Production (kWh)",
                data: monthlyInsolation.map(insolation => insolation * panelDailyOutput),
                borderColor: "#f39c12",
                backgroundColor: "rgba(243, 156, 18, 0.2)",
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy Production (kWh)'
                    }
                }
            }
        }
    });
}

function generateMonthlyEnergyProductionChart(monthlyInsolation, numberOfPanels, panelDailyOutput) {
    const ctx = document.getElementById("monthlyEnergyProductionChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "Total Monthly Energy Production (kWh)",
                data: monthlyInsolation.map(insolation => insolation * panelDailyOutput * numberOfPanels * 30),
                backgroundColor: "#3498db"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy Production (kWh)'
                    }
                }
            }
        }
    });
}

function generateSystemEfficiencyChart(systemEfficiency) {
    const ctx = document.getElementById("systemEfficiencyChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "System Efficiency (%)",
                data: systemEfficiency,
                borderColor: "#8e44ad",
                backgroundColor: "rgba(142, 68, 173, 0.2)",
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Efficiency (%)'
                    }
                }
            }
        }
    });
}

function generatePanelComparisonChart(averagePanelOutput) {
    const ctx = document.getElementById("panelComparisonChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["SLX170", "SLX175", "SLX180"],
            datasets: [{
                label: "Average Daily Output (kWh)",
                data: Object.values(averagePanelOutput),
                backgroundColor: ["#e74c3c", "#2ecc71", "#3498db"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Daily Output (kWh)'
                    }
                }
            }
        }
    });
}
