import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { Loading, MetricCard, FunnelChart, CategoryPerformance, BarChart } from '../../components';
import Wrapper from '../../assets/wrappers/AdvancedStats';
import {
    FaSuitcase,
    FaChartLine,
    FaCheckCircle,
    FaCalendarWeek,
    FaPercentage,
    FaTrophy
} from 'react-icons/fa';

const AdvancedStats = () => {
    const { getAdvancedAnalytics, isLoadingAnalytics, advancedAnalytics } = useAppContext();

    useEffect(() => {
        getAdvancedAnalytics();
        // eslint-disable-next-line
    }, []);

    if (isLoadingAnalytics) {
        return <Loading center />;
    }

    if (!advancedAnalytics) {
        return <Loading center />;
    }

    const {
        totalJobs,
        responseRate,
        successRate,
        avgAppsPerWeek,
        categoryPerformance,
        conversionFunnel,
        recentApplications,
        jobTypeDistribution,
        monthlyTrend,
    } = advancedAnalytics;

    return (
        <Wrapper>
            <h2>Advanced Analytics Dashboard</h2>

            {/* Key Metrics Section */}
            <div className="metrics-grid">
                <MetricCard
                    icon={<FaSuitcase />}
                    title="Total Applications"
                    value={totalJobs}
                    color="var(--primary-500)"
                />
                <MetricCard
                    icon={<FaPercentage />}
                    title="Response Rate"
                    value={`${responseRate}%`}
                    subtitle="of applications"
                    color="#f59e0b"
                />
                <MetricCard
                    icon={<FaTrophy />}
                    title="Interview Rate"
                    value={`${successRate}%`}
                    subtitle="success rate"
                    color="#10b981"
                />
                <MetricCard
                    icon={<FaCalendarWeek />}
                    title="Weekly Velocity"
                    value={avgAppsPerWeek}
                    subtitle="apps per week"
                    color="#8b5cf6"
                />
                <MetricCard
                    icon={<FaCheckCircle />}
                    title="Last 7 Days"
                    value={recentApplications.last7Days}
                    subtitle="applications"
                    color="#06b6d4"
                />
                <MetricCard
                    icon={<FaChartLine />}
                    title="Last 30 Days"
                    value={recentApplications.last30Days}
                    subtitle="applications"
                    color="#ec4899"
                />
            </div>

            {/* Conversion Funnel */}
            <div className="section">
                <FunnelChart data={conversionFunnel} />
            </div>

            {/* Category Performance */}
            <div className="section">
                <CategoryPerformance data={categoryPerformance} />
            </div>

            {/* Monthly Trend Chart */}
            {monthlyTrend && monthlyTrend.length > 0 && (
                <div className="section">
                    <div className="chart-container">
                        <h4>6-Month Application Trend</h4>
                        <BarChart data={monthlyTrend} />
                    </div>
                </div>
            )}

            {/* Job Type Distribution */}
            {jobTypeDistribution && jobTypeDistribution.length > 0 && (
                <div className="section">
                    <div className="job-type-container">
                        <h4>Job Type Distribution</h4>
                        <div className="job-type-list">
                            {jobTypeDistribution.map((type, index) => (
                                <div key={index} className="job-type-item">
                                    <div className="job-type-header">
                                        <span className="job-type-name">{type.type}</span>
                                        <span className="job-type-count">{type.count} jobs</span>
                                    </div>
                                    <div className="job-type-bar">
                                        <div
                                            className="job-type-fill"
                                            style={{ width: `${type.percentage}%` }}
                                        />
                                    </div>
                                    <span className="job-type-percentage">{type.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
};

export default AdvancedStats;
