// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { dashboardService } from '../api/dashboardService';
import Loader from '../components/common/Loader';
import { subDays, format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Import Chart.js and React wrapper
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Title } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { FiTrendingUp, FiCheckCircle, FiDollarSign, FiUsers, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';

// Register all the Chart.js components we'll use
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Title);

// Reusable Stat Card component
const StatCard = ({ icon, title, value, detail, color }) => (
    <div className="stat-card-v2" style={{ borderBottomColor: color }}>
        <div className="stat-card-v2__icon" style={{ color }}>{icon}</div>
        <div className="stat-card-v2__info">
            <span className="stat-card-v2__title">{title}</span>
            <span className="stat-card-v2__value">{value}</span>
            {detail && <span className="stat-card-v2__detail">{detail}</span>}
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Date filter state
    const [filterPeriod, setFilterPeriod] = useState('30d');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');

            let params = {};
            if (filterPeriod === 'custom' && startDate && endDate) {
                params = {
                    startDate: format(startDate, "yyyy-MM-dd'T'00:00:00"),
                    endDate: format(endDate, "yyyy-MM-dd'T'23:59:59"),
                };
            } else if (filterPeriod !== 'all' && filterPeriod !== 'custom') {
                const days = parseInt(filterPeriod.replace('d', ''));
                params = { startDate: format(subDays(new Date(), days), "yyyy-MM-dd'T'00:00:00") };
            }

            try {
                const response = await dashboardService.getDashboardStats(params);
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filterPeriod, dateRange]);

    const handleFilterChange = (period) => {
        setFilterPeriod(period);
        if (period !== 'custom') setDateRange([null, null]);
    };

    // --- Chart Configurations ---

    const requestsByDateChartData = {
        labels: stats?.requestsByDate ? Object.keys(stats.requestsByDate).sort() : [],
        datasets: [{
            label: 'So\'rovlar',
            data: stats?.requestsByDate ? Object.keys(stats.requestsByDate).sort().map(key => stats.requestsByDate[key]) : [],
            borderColor: '#e94560',
            backgroundColor: 'rgba(233, 69, 96, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    };

    // =================================================================================
    // THE FIX IS HERE: Updated to use lowercase 'withdrawal' and 'top_up' keys
    // =================================================================================
    const platformGraphLabels = stats?.platformGraphData ? Object.keys(stats.platformGraphData) : [];
    const platformGraphData = {
        labels: platformGraphLabels,
        datasets: [
            {
                label: 'To\'ldirilgan (Top-up)',
                data: platformGraphLabels.map(p => stats.platformGraphData[p]['top_up'] || 0), // <-- FIXED
                backgroundColor: '#53bf9d',
            },
            {
                label: 'Yechib olingan (Withdrawal)',
                data: platformGraphLabels.map(p => stats.platformGraphData[p]['withdrawal'] || 0), // <-- FIXED
                backgroundColor: '#e94560',
            },
        ],
    };

    const STATUS_COLORS = { APPROVED: '#53bf9d', PENDING: '#fca130', PENDING_ADMIN: '#fca130', PENDING_SMS: '#fca130', PENDING_PAYMENT: '#fca130', FAILED: '#ff5c5c', CANCELED: '#6c757d', default: '#16213e' };
    const statusLabels = stats?.statusDistribution ? Object.keys(stats.statusDistribution) : [];
    const statusChartData = {
        labels: statusLabels,
        datasets: [{
            data: statusLabels.map(label => stats.statusDistribution[label]),
            backgroundColor: statusLabels.map(status => STATUS_COLORS[status] || STATUS_COLORS.default),
            borderColor: '#1a1a2e',
            borderWidth: 4,
            hoverOffset: 10,
        }],
    };

    const chartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { color: '#e0e0e0' } }, title: { display: true, text: title, color: '#e0e0e0', font: { size: 16 } } },
        scales: { y: { stacked: true, ticks: { color: '#a0a0a0' }, grid: { color: '#333' } }, x: { stacked: true, ticks: { color: '#a0a0a0' }, grid: { color: 'transparent' } } },
    });

    const donutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: "Statuslar Taqsimoti", color: '#e0e0e0', font: { size: 20, weight: 'bold' } },
            legend: { position: 'bottom', labels: { color: '#e0e0e0', padding: 20, font: { size: 14 } } }
        },
        cutout: '60%',
    };

    if (isLoading) return <Loader />;
    if (error) return <p className="error-message">{error}</p>;
    if (!stats) return <p>Ma'lumotlar topilmadi.</p>;

    return (
        <div className="page-container dashboard-v2">
            <header className="dashboard-header">
                <h1>Boshqaruv Paneli</h1>
                <div className="filter-controls">
                    <button onClick={() => handleFilterChange('7d')} className={filterPeriod === '7d' ? 'active' : ''}>7 Kun</button>
                    <button onClick={() => handleFilterChange('30d')} className={filterPeriod === '30d' ? 'active' : ''}>30 Kun</button>
                    <button onClick={() => handleFilterChange('90d')} className={filterPeriod === '90d' ? 'active' : ''}>90 Kun</button>
                    <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={(update) => { setDateRange(update); setFilterPeriod('custom'); }} isClearable={true} placeholderText="Maxsus oraliq" className={`custom-datepicker ${filterPeriod === 'custom' ? 'active' : ''}`}/>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard icon={<FiArrowDownCircle/>} title="Jami Yechilgan" value={`${stats.totalApprovedWithdrawalAmount?.toLocaleString('uz-UZ') || 0} so'm`} detail="Tasdiqlangan" color="#e94560" />
                <StatCard icon={<FiArrowUpCircle/>} title="Jami To'ldirilgan" value={`${stats.totalApprovedTopUpAmount?.toLocaleString('uz-UZ') || 0} so'm`} detail="Tasdiqlangan" color="#53bf9d" />
                <StatCard icon={<FiTrendingUp/>} title="Jami So'rovlar" value={stats.totalRequests?.toLocaleString() || 0} detail={`${stats.approvedRequests?.toLocaleString() || 0} tasdiqlangan`} color="#3498db" />
                <StatCard icon={<FiUsers/>} title="Top Foydalanuvchi" value={`${Object.keys(stats.topUsers || {})[0] || 'N/A'}`} detail={`${Object.values(stats.topUsers || {})[0] || 0} so'rov bilan`} color="#fca130" />
            </div>

            <div className="dashboard-main-content-grid">
                <div className="main-column">
                    <div className="chart-container-v2 area-chart">
                        <Line options={{...chartOptions('Vaqt Bo\'yicha Faollik'), plugins: {legend: {display: false}}}} data={requestsByDateChartData} />
                    </div>
                    <div className="chart-container-v2 stacked-bar-chart">
                        <Bar options={chartOptions('Platforma Bo\'yicha Moliya')} data={platformGraphData} />
                    </div>
                </div>

                <div className="sidebar-column">
                    <div className="chart-container-v2 donut-hero-chart">
                        <Doughnut data={statusChartData} options={donutChartOptions} />
                    </div>
                    <div className="table-container-v2">
                        <h3>Eng Faol Foydalanuvchilar</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Foydalanuvchi ID</th><th>So'rovlar Soni</th></tr></thead>
                                <tbody>
                                {stats.topUsers ? Object.entries(stats.topUsers).slice(0, 5).map(([userId, count]) => (
                                    <tr key={userId}><td>{userId}</td><td>{count}</td></tr>
                                )) : <tr><td colSpan="2">Ma'lumot yo'q</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;