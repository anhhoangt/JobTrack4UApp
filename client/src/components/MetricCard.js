import Wrapper from '../assets/wrappers/MetricCard';

const MetricCard = ({ icon, title, value, subtitle, color, trend, trendValue }) => {
    return (
        <Wrapper color={color}>
            <header>
                <div className="icon-container">
                    {icon}
                </div>
                <div className="info">
                    <h5>{title}</h5>
                    <div className="value-container">
                        <span className="value">{value}</span>
                        {subtitle && <span className="subtitle">{subtitle}</span>}
                    </div>
                    {trend && (
                        <div className={`trend ${trend}`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                        </div>
                    )}
                </div>
            </header>
        </Wrapper>
    );
};

export default MetricCard;
