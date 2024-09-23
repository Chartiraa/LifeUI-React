import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, ArcElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, } from 'chart.js';

import '../css/Graphs.css';

// Chart.js modüllerini kaydedin
ChartJS.register(LineElement, ArcElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function hexToRGBA(hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const colorList = [
    '#FF6384', '#36A2EB', '#FAAE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF',
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF',
    '#36A2EB', '#FFCE56', '#FF6384', '#FF9F40'
];

const LineChart = (props) => {
    // Grafik verisi

    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7'], // X ekseni etiketleri
        datasets: [
            {
                label: `${props.graphLabel}`,
                data: [60, 70, 40, 20, 30, 50, 60], // Grafik verisi
                fill: false, // Dolgu rengini kaldırmak için
                borderColor: hexToRGBA(`${props.lineColor}`, 0.6), // Çizgi rengi
                backgroundColor: hexToRGBA(`${props.lineColor}`, 0.2), // Nokta arka plan rengi
                pointBorderColor: hexToRGBA(`${props.lineColor}`, 1), // Nokta kenar rengi
                pointBackgroundColor: '#fff', // Nokta içi rengi
                pointHoverBackgroundColor: hexToRGBA(`${props.lineColor}`, 1), // Nokta üzerine gelinceki içi rengi
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
                <i className={`bi graph-icon ${props.icon}`} ></i>
                <label>{props.label}</label>
            </div>
            <Line className='graph' data={data} options={options} />
        </div>
    );
};

const PieChart = (props) => {
    // Grafik verisi
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7'], // X ekseni etiketleri
        datasets: [
            {
                label: `${props.graphLabel}`,
                data: [60, 70, 40, 20, 30, 50, 80], // Grafik verisi
                backgroundColor: colorList.map(color => hexToRGBA(color, 0.6)), // Renk listesinden arka plan renkleri
                borderColor: colorList.map(color => hexToRGBA(color, 1)), // Renk listesinden kenar renkleri
                borderWidth: 1,
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
    };

    return (
        <div className='graph-container'>
            <div className='graph-label'>
                <i className={`bi graph-icon ${props.icon}`} ></i>
                <label>{props.label}</label>
            </div>
            <Pie className='graph' data={data} options={options} />
        </div>
    );
};

export { LineChart, PieChart };
