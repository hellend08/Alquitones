import { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { useInstrumentState } from "../../context/InstrumentContext";
import { useCategoryState } from "../../context/CategoryContext";
import { useUserState } from "../../context/UserContext";
import { apiService } from '../../services/apiService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { instruments } = useInstrumentState();
    const { users } = useUserState();
    const { categories } = useCategoryState();
    const [reservations, setReservations] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [topInstruments, setTopInstruments] = useState([]);
    const [reservationsByMonth, setReservationsByMonth] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await apiService.getAllReservations();
                setReservations(response.data);
                processReservationsData(response.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchReservations();
    }, []);

    const processReservationsData = (reservationsData) => {
        // Procesar datos para la gráfica de dona (estados de reservas)
        const statusCounts = reservationsData.reduce((acc, reservation) => {
            const status = reservation.status === 'ENDED' ? 'Finalizadas' : 
                          reservation.status === 'ACTIVE' ? 'En Curso' : reservation.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Procesar datos para la gráfica de línea (facturación mensual)
        const monthlyRevenue = {};
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        // Inicializar todos los meses con 0
        months.forEach(month => {
            monthlyRevenue[month] = 0;
        });

        // Procesar las reservas
        reservationsData.forEach(reservation => {
            const date = new Date(reservation.startDate);
            const monthName = months[date.getMonth()];
            monthlyRevenue[monthName] += (reservation.totalPrice || 0);
        });

        // Procesar datos para la gráfica de barras (top 5 instrumentos)
        const instrumentCounts = reservationsData.reduce((acc, reservation) => {
            const instrument = instruments.find(i => i.id === reservation.instrumentId);
            if (instrument) {
                acc[instrument.name] = (acc[instrument.name] || 0) + 1;
            }
            return acc;
        }, {});

        // Procesar datos para la gráfica de columnas (reservas por mes)
        const reservationsByMonthData = {};
        // Inicializar todos los meses con 0
        months.forEach(month => {
            reservationsByMonthData[month] = 0;
        });

        // Procesar las reservas
        reservationsData.forEach(reservation => {
            const date = new Date(reservation.startDate);
            const monthName = months[date.getMonth()];
            reservationsByMonthData[monthName] += 1;
        });

        // Actualizar estados
        setMonthlyData(Object.entries(monthlyRevenue).map(([month, revenue]) => ({
            month,
            revenue
        })));

        setTopInstruments(
            Object.entries(instrumentCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }))
        );

        setReservationsByMonth(
            Object.entries(reservationsByMonthData)
                .map(([month, count]) => ({ month, count }))
        );
    };

    // Configuración de la gráfica de dona
    const doughnutData = {
        labels: ['Finalizadas', 'En Curso'],
        datasets: [{
            data: [
                reservations.filter(r => r.status === 'ENDED').length,
                reservations.filter(r => r.status === 'ACTIVE').length
            ],
            backgroundColor: ['#4CAF50', '#2196F3'],
            borderWidth: 1
        }]
    };

    // Configuración de la gráfica de línea
    const lineData = {
        labels: monthlyData.map(d => d.month),
        datasets: [{
            label: 'Facturación Mensual',
            data: monthlyData.map(d => d.revenue),
            borderColor: '#9C6615',
            backgroundColor: 'rgba(156, 102, 21, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    // Configuración de la gráfica de barras horizontales
    const barData = {
        labels: topInstruments.map(i => i.name),
        datasets: [{
            label: 'Reservas',
            data: topInstruments.map(i => i.count),
            backgroundColor: '#001F3F'
        }]
    };

    // Configuración de la gráfica de columnas
    const columnData = {
        labels: reservationsByMonth.map(d => d.month),
        datasets: [{
            label: 'Cantidad de Reservas',
            data: reservationsByMonth.map(d => d.count),
            backgroundColor: '#9C6615'
        }]
    };

    // Opciones comunes para las gráficas
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    // Opciones específicas para la gráfica de barras horizontales
    const horizontalBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Reservas'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Instrumentos'
                }
            }
        }
    };

    // Calcular KPIs
    const totalUsers = users.length;
    const totalInstruments = instruments.reduce((acc, instrument) => acc + (instrument.stock || 0), 0);
    
    const totalReservedInstruments = reservations.reduce((acc, reservation) => {
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        const today = new Date();
        if (startDate <= today && endDate >= today) {
            return acc + reservation.quantity;
        }
        return acc;
    }, 0);
    const reservedPercentage = totalInstruments > 0 ? (totalReservedInstruments / totalInstruments) * 100 : 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyReservations = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.startDate);
        return reservationDate.getMonth() === currentMonth && reservationDate.getFullYear() === currentYear;
    }).length;
    const totalStock = instruments.reduce((acc, instrument) => acc + (instrument.stock || 0), 0);

    // Definir los KPIs con sus íconos y colores
    const kpis = [
        {
            title: 'Usuarios Totales',
            value: totalUsers,
            icon: 'fa-users',
            color: '#001F3F',
            trend: '+5%',
            trendUp: true
        },
        {
            title: 'Reservas del Mes',
            value: monthlyReservations,
            icon: 'fa-calendar-check',
            color: '#9C6615',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Stock Total',
            value: totalStock,
            icon: 'fa-boxes',
            color: '#001F3F',
            trend: '-2%',
            trendUp: false
        },
        {
            title: 'Instrumentos Reservados',
            value: `${reservedPercentage.toFixed(1)}%`,
            icon: 'fa-guitar',
            color: '#9C6615',
            trend: '+8%',
            trendUp: true
        }
    ];

    return (
        <div className={styles.dashboardContent}>
            <div className={styles.dashboardHeader}>
                <h2 className="text-(--color-secondary) text-2xl font-bold">Dashboard</h2>
                <p className="text-gray-600">Resumen general del sistema</p>
            </div>

            <div className={styles.kpiGrid}>
                {kpis.map((kpi, index) => (
                    <div key={index} className={styles.kpiCard}>
                        <div className={styles.kpiIcon} style={{ backgroundColor: `${kpi.color}20` }}>
                            <i className={`fas ${kpi.icon}`} style={{ color: kpi.color }}></i>
                        </div>
                        <div className={styles.kpiInfo}>
                            <h3 className={styles.kpiTitle}>{kpi.title}</h3>
                            <div className={styles.kpiValue}>{kpi.value}</div>
                            <div className={`${styles.kpiTrend} ${kpi.trendUp ? styles.trendUp : styles.trendDown}`}>
                                <i className={`fas ${kpi.trendUp ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                                {kpi.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.dashboardCharts}>
                <div className={styles.chartCard}>
                    <h3 className="text-(--color-secondary) text-lg font-semibold mb-4">Estado de Reservas</h3>
                    <div className={styles.chartContainer}>
                        <Doughnut data={doughnutData} options={chartOptions} />
                    </div>
                </div>
                <div className={styles.chartCard}>
                    <h3 className="text-(--color-secondary) text-lg font-semibold mb-4">Facturación Mensual</h3>
                    <div className={styles.chartContainer}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
                <div className={styles.chartCard}>
                    <h3 className="text-(--color-secondary) text-lg font-semibold mb-4">Top 5 Instrumentos más Reservados</h3>
                    <div className={styles.chartContainer}>
                        <Bar data={barData} options={horizontalBarOptions} />
                    </div>
                </div>
                <div className={styles.chartCard}>
                    <h3 className="text-(--color-secondary) text-lg font-semibold mb-4">Reservas por Mes</h3>
                    <div className={styles.chartContainer}>
                        <Bar data={columnData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 