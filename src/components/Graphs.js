import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

import '../css/Graphs.css';

// Chart.js modüllerini kaydedin
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LineChart = () => {
    // Grafik verisi
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7'], // X ekseni etiketleri
        datasets: [
            {
                label: 'Sıvı ',
                data: [60, 70, 40, 20, 30, 50, 80], // Grafik verisi
                fill: false, // Dolgu rengini kaldırmak için
                borderColor: 'rgba(54, 162, 235, 0.6)', // Çizgi rengi
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Nokta arka plan rengi
                pointBorderColor: 'rgba(54, 162, 235, 1)', // Nokta kenar rengi
                pointBackgroundColor: '#fff', // Nokta içi rengi
                pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)', // Nokta üzerine gelinceki içi rengi
                pointHoverBorderColor: 'rgba(220, 220, 220, 1)', // Nokta üzerine gelinceki kenar rengi
                pointRadius: 5, // Nokta yarıçapı
                pointHoverRadius: 7, // Nokta üzerine gelinceki yarıçap
                tension: 0.3, // Çizgi eğriliği
            },
        ],
    };

    // Grafik ayarları
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Efsane konumu
                labels: {
                    boxWidth: 30,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // X eksenindeki ızgaraları gizle
                },
            },
            y: {
                beginAtZero: true,
                max: 80, // Y ekseni maksimum değeri
                grid: {
                    display: true, // Y eksenindeki ızgaraları göster
                },
            },
        },
    };

    return (
        <div className='graph-container'>
            <div className='graph-label'>
                <i class="bi bi-droplet-fill graph-icon"></i>
                <label>Sıvı Seviyesi</label>
            </div>
            <Line className='graph' data={data} options={options} />
        </div>
    );
};

export default LineChart;
