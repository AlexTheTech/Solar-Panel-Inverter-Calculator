// advanced_script.js

document.addEventListener("DOMContentLoaded", function() {
    // Prefill input fields with standard data
    document.getElementById("energy-production").value = 5000;
    document.getElementById("panel-type").value = "SLX170";
    document.getElementById("dirt-loss").value = 5; // 5% dirt and mismatch loss
    document.getElementById("temperature-coefficient").value = 0.45; // %/°C
    document.getElementById("tilt-option").value = "30";
    document.getElementById("cable-loss").value = 2; // 2% cable loss
    document.getElementById("inverter-efficiency").value = 95; // 95% efficiency
});

document.getElementById("advanced-calculate-button").addEventListener("click", () => {
    // Get User Inputs
    const targetEnergyProduction = parseFloat(document.getElementById("energy-production").value);
    const panelType = document.getElementById("panel-type").value;
    const dirtLoss = parseFloat(document.getElementById("dirt-loss").value) / 100;
    const temperatureCoefficient = parseFloat(document.getElementById("temperature-coefficient").value);
    const tiltOption = document.getElementById("tilt-option").value;
    const cableLoss = parseFloat(document.getElementById("cable-loss").value) / 100;
    const inverterEfficiency = parseFloat(document.getElementById("inverter-efficiency").value) / 100;

    // Validate inputs
    if (isNaN(targetEnergyProduction) || targetEnergyProduction <= 0) {
        alert("Please enter a valid target energy production value.");
        return;
    }

    // Panel Data
    const PANEL_DATA = {
        SLX170: { power: 170 },
        SLX175: { power: 175 },
        SLX180: { power: 180 }
    };

    const panel = PANEL_DATA[panelType];

    // Insolation Data
    const INSOLATION_DATA = {
        monthlyInsolationTilted30: [
            6.61, 6.39, 5.42, 4.25, 3.01, 2.58, 2.62, 3.44, 4.40, 5.33, 6.00, 6.43
        ],
        monthlyInsolationHorizontal: [
            6.67, 5.94, 4.53, 3.17, 2.11, 1.69, 1.82, 2.58, 3.45, 4.28, 5.89, 6.53
        ]
    };

    const insolationData = tiltOption === "30" ? INSOLATION_DATA.monthlyInsolationTilted30 : INSOLATION_DATA.monthlyInsolationHorizontal;

    // Calculate Average Insolation
    const averageInsolation = insolationData.reduce((acc, val) => acc + val, 0) / 12;

    // Calculate Temperature Adjustment
    const STANDARD_TEMPERATURE = 25;
    const averageTemperature = 19.8; // Average yearly temperature (replace as needed)
    const temperatureDifference = averageTemperature - STANDARD_TEMPERATURE;
    const temperatureLossFactor = 1 + (temperatureCoefficient / 100) * temperatureDifference;

    // Calculate System Efficiency
    const systemEfficiency = (1 - dirtLoss) * (1 - cableLoss) * inverterEfficiency * temperatureLossFactor;

    // Calculate Panel Daily Output Considering Average Insolation and Efficiency Losses
    const panelRatedOutput = panel.power / 1000; // Convert W to kW
    const panelDailyOutput = panelRatedOutput * averageInsolation * systemEfficiency; // kWh/day per panel

    // Calculate Daily Energy Requirement from Yearly Target
    const dailyEnergyRequirement = targetEnergyProduction / 365; // kWh/day

    // Calculate Number of Panels Required to Meet Target Daily Energy Production
    const numberOfPanels = Math.ceil(dailyEnergyRequirement / panelDailyOutput);

    // Calculate Panel Configuration Using Sequential Assignment Logic
    let remainingPanels = numberOfPanels;
    let inverterCount = 0;
    let configurations = [];

    // Loop through and assign panels to inverters until all panels are used up
    while (remainingPanels > 0) {
        inverterCount++;
        let panelsForThisInverter = Math.min(remainingPanels, 16); // Assign up to 16 panels per inverter
        remainingPanels -= panelsForThisInverter;

        configurations.push({
            inverter: inverterCount,
            panels: panelsForThisInverter
        });
    }

    // Construct panel configuration string in a flexible box layout
    let configurationHtml = configurations.map(config => `
        <div class="configuration-item" style="flex: 1 1 calc(25% - 20px); margin: 10px; padding: 20px; background-color: #fff4e6; border-radius: 12px; border: 2px solid #e67e22; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); text-align: center;">
            <h3 style="margin: 0 0 10px; font-size: 20px; color: #d35400;">Inverter ${config.inverter}</h3>
            <p style="margin: 0; font-size: 18px; color: #333;">${config.panels} Panels</p>
        </div>
    `).join('');

    // Update the DOM with the results
    document.getElementById("panels-required").textContent = `Number of Panels Required: ${numberOfPanels}`;
    document.getElementById("inverters-required").textContent = `Number of Inverters Required: ${inverterCount}`;
    document.getElementById("configuration").innerHTML = `<div style="display: flex; flex-wrap: wrap; justify-content: center;">${configurationHtml}</div>`;
    document.getElementById("estimated-power").textContent = `Average Daily Power Production per Panel: ${panelDailyOutput.toFixed(2)} kWh`;

    // Store the monthly energy values for the chart
    let monthlyEnergyValues = [];

    // Distribute total energy production over the months using monthly insolation data
    insolationData.forEach((insolation, index) => {
        // Proportional monthly production based on insolation
        const monthlyProportion = insolation / averageInsolation;
        const monthlyEnergy = parseFloat((monthlyProportion * targetEnergyProduction / 12).toFixed(2)); // Proportion of the total yearly energy
        monthlyEnergyValues.push(monthlyEnergy);
    });

    // If chart already exists, destroy it to prevent duplication issues, then create a new one
    if (window.monthlyPowerChart) {
        if (window.monthlyPowerChart && typeof window.monthlyPowerChart.destroy === 'function') {
        window.monthlyPowerChart.destroy();
    }
    }

    // Create the chart with Chart.js
    const ctx = document.getElementById('monthlyPowerChart').getContext('2d');
    window.monthlyPowerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: 'Monthly Power Delivery (kWh)',
                data: monthlyEnergyValues,
                backgroundColor: 'rgba(41, 128, 185, 0.5)', // Color of the bars
                borderColor: 'rgba(41, 128, 185, 1)', // Border color
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy (kWh)'
                    }
                }
            }
        }
    });
});
