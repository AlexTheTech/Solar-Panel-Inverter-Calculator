// mppt_analysis.js

document.addEventListener("DOMContentLoaded", function() {
    // Get references to input elements
    const voltageInput = document.getElementById("voltage-input");
    const currentInput = document.getElementById("current-input");
    const mpptCalculateButton = document.getElementById("mppt-calculate-button");

    // Get reference to the MPPT chart canvas
    const ctxMPPTChart = document.getElementById("mpptChart").getContext("2d");
    let mpptChart;

    // Event listener for the calculate button
    mpptCalculateButton.addEventListener("click", function() {
        // Parse input values
        const voltage = parseFloat(voltageInput.value);
        const current = parseFloat(currentInput.value);

        // Validate inputs
        if (isNaN(voltage) || isNaN(current) || voltage <= 0 || current <= 0) {
            alert("Please enter valid positive numbers for voltage and current.");
            return;
        }

        // Calculate power curve (simple linear relation for demonstration)
        const powerCurve = [];
        const efficiencyCurve = [];
        for (let v = 0; v <= voltage * 2; v += 1) {
            let currentForV = (v <= voltage) ? (current / voltage) * v : current;
            let power = v * currentForV;
            powerCurve.push(power);

            // Efficiency drops off at high voltages
            efficiencyCurve.push((v <= voltage) ? 1 : Math.max(0.5, 1 - ((v - voltage) / voltage) * 0.5));
        }

        // If chart already exists, destroy it to prevent duplication issues
        if (mpptChart) {
            mpptChart.destroy();
        }

        // Create a new MPPT chart
        mpptChart = new Chart(ctxMPPTChart, {
            type: 'line',
            data: {
                labels: Array.from({ length: powerCurve.length }, (_, i) => `V = ${i}V`),
                datasets: [{
                    label: 'Power Output (W)',
                    data: powerCurve,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    borderWidth: 2
                },
                {
                    label: 'Efficiency',
                    data: efficiencyCurve,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    fill: true,
                    borderWidth: 2,
                    yAxisID: 'y-efficiency'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Power Output (W)'
                        }
                    },
                    'y-efficiency': {
                        position: 'right',
                        beginAtZero: true,
                        max: 1.2,
                        title: {
                            display: true,
                            text: 'Efficiency'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    });
});
