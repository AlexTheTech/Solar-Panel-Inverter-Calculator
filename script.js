// Constants for Panel Data
const PANEL_DATA = {
    SLX170: {
        power: 170, // Watts
        efficiencyLoss: 0.05, // 5% loss due to mismatch and dirt
        temperatureCoefficient: -0.0045, // %/°C
        tolerance: 0.03 // 3% manufacturer tolerance
    },
    SLX175: {
        power: 175, // Watts
        efficiencyLoss: 0.05,
        temperatureCoefficient: -0.0045,
        tolerance: 0.03
    },
    SLX180: {
        power: 180, // Watts
        efficiencyLoss: 0.05,
        temperatureCoefficient: -0.0045,
        tolerance: 0.03
    }
};

// Constants for Insolation Data
const INSOLATION_DATA = {
    monthlyInsolationTilted30: [
        6.61, 6.39, 5.42, 4.25, 3.01, 2.58, 2.62, 3.44, 4.40, 5.33, 6.00, 6.43
    ],
    monthlyInsolationHorizontal: [
        6.67, 5.94, 4.53, 3.17, 2.11, 1.69, 1.82, 2.58, 3.45, 4.28, 5.89, 6.53
    ]
};

const TEMPERATURE_DATA = [
    25.9, 25.8, 23.9, 20.3, 16.7, 14.0, 13.4, 15.7, 17.2, 19.6, 21.9, 24.2
];
const STANDARD_TEMPERATURE = 25; // °C (Standard Testing Condition)

// Variable to hold chart instance
let monthlyPowerChart;

// Event listener for the "Calculate" button
document.getElementById("calculate-button").addEventListener("click", () => {
    // Get User Inputs
    const targetEnergyProduction = parseFloat(document.getElementById("energy-production").value);
    const panelType = document.getElementById("panel-type").value;
    const tiltOption = document.getElementById("tilt-option").value;

    // Validate input
    if (isNaN(targetEnergyProduction) || targetEnergyProduction <= 0) {
        alert("Please enter a valid energy production value.");
        return;
    }

    // Get Panel Data
    const panel = PANEL_DATA[panelType];

    // Select Appropriate Insolation Data Based on Tilt Option
    const insolationData = tiltOption === "30" ? INSOLATION_DATA.monthlyInsolationTilted30 : INSOLATION_DATA.monthlyInsolationHorizontal;

    // Calculate Average Insolation
    const averageInsolation = insolationData.reduce((acc, val) => acc + val, 0) / 12;

    // Calculate Temperature Adjustment
    const averageTemperature = TEMPERATURE_DATA.reduce((acc, val) => acc + val, 0) / 12;
    const temperatureDifference = averageTemperature - STANDARD_TEMPERATURE;
    const temperatureLossFactor = 1 + panel.temperatureCoefficient * temperatureDifference;

    // Calculate System Efficiency
    const systemEfficiency = 0.95 * 0.90 * 0.95 * temperatureLossFactor;

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

    // Construct panel configuration string
    let configurationHtml = configurations.map(config => `
        <div class="configuration-item">
            <h3>Inverter ${config.inverter}</h3>
            <p>${config.panels} Panels</p>
        </div>
    `).join('');

    // Update the DOM with the results
    document.getElementById("panels-required").textContent = `Number of Panels Required: ${numberOfPanels}`;
    document.getElementById("inverters-required").textContent = `Number of Inverters Required: ${inverterCount}`;
    document.getElementById("configuration").innerHTML = configurationHtml;
    document.getElementById("estimated-power").textContent = `Average Daily Power Production per Panel: ${panelDailyOutput.toFixed(2)} kWh`;

    // Store the monthly energy values for the chart
    let monthlyEnergyValues = [];

    // Distribute total energy production over the months using monthly insolation data
    insolationData.forEach((insolation, index) => {
        // Proportional monthly production based on insolation
        const monthlyProportion = insolation / averageInsolation;
        const monthlyEnergy = monthlyProportion * targetEnergyProduction / 12; // Proportion of the total yearly energy
        monthlyEnergyValues.push(monthlyEnergy.toFixed(2));
    });

    // If chart already exists, update it; otherwise create a new one
    if (monthlyPowerChart) {
        monthlyPowerChart.data.datasets[0].data = monthlyEnergyValues;
        monthlyPowerChart.update();
    } else {
        // Create the chart with Chart.js for the first time
        const ctx = document.getElementById('monthlyPowerChart').getContext('2d');
        monthlyPowerChart = new Chart(ctx, {
            type: 'bar', // or 'line' for a line chart
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [{
                    label: 'Monthly Power Delivery (kWh)',
                    data: monthlyEnergyValues,
                    backgroundColor: 'rgba(52, 152, 219, 0.5)', // Color of the bars
                    borderColor: 'rgba(52, 152, 219, 1)', // Border color
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
    }
});
