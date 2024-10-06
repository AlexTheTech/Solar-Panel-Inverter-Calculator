// graphs.js

// Include Chart.js library (make sure to include Chart.js in your HTML before this script)

document.addEventListener("DOMContentLoaded", () => {
    // Monthly Insolation vs Temperature Graph
    const ctxInsolationTemp = document.getElementById("insolationTempChart").getContext("2d");
    const insolationTempChart = new Chart(ctxInsolationTemp, {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "Monthly Insolation (kWh/m²/day)",
                    data: [6.67, 5.94, 4.53, 3.17, 2.11, 1.69, 1.82, 2.58, 3.45, 4.28, 5.89, 6.53],
                    borderColor: "#f39c12",
                    backgroundColor: "rgba(243, 156, 18, 0.2)",
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: "Average Temperature (°C)",
                    data: [25.9, 25.8, 23.9, 20.3, 16.7, 14.0, 13.4, 15.7, 17.2, 19.6, 21.9, 24.2],
                    borderColor: "#3498db",
                    backgroundColor: "rgba(52, 152, 219, 0.2)",
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Insolation (kWh/m²/day)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });

    // Energy Production per Panel Type per Month
    const ctxEnergyProduction = document.getElementById("energyProductionChart").getContext("2d");
    const energyProductionChart = new Chart(ctxEnergyProduction, {
        type: 'bar',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "SLX170",
                    data: [1.12, 1.00, 0.76, 0.53, 0.36, 0.29, 0.31, 0.44, 0.59, 0.73, 1.00, 1.11],
                    backgroundColor: "#e74c3c"
                },
                {
                    label: "SLX175",
                    data: [1.15, 1.03, 0.78, 0.54, 0.37, 0.30, 0.32, 0.46, 0.61, 0.75, 1.03, 1.14],
                    backgroundColor: "#2ecc71"
                },
                {
                    label: "SLX180",
                    data: [1.19, 1.06, 0.81, 0.56, 0.38, 0.31, 0.33, 0.47, 0.63, 0.78, 1.06, 1.17],
                    backgroundColor: "#3498db"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Daily Energy Production (kWh)'
                    }
                }
            }
        }
    });

    // Total System Efficiency Over the Year
    const ctxEfficiency = document.getElementById("systemEfficiencyChart").getContext("2d");
    const systemEfficiencyChart = new Chart(ctxEfficiency, {
        type: 'line',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
                {
                    label: "System Efficiency (%)",
                    data: [82, 80, 79, 76, 74, 73, 72, 75, 77, 78, 81, 82],
                    borderColor: "#8e44ad",
                    backgroundColor: "rgba(142, 68, 173, 0.2)",
                    fill: true
                }
            ]
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
});
