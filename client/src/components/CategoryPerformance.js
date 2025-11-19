import Wrapper from '../assets/wrappers/CategoryPerformance';

const CategoryPerformance = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Wrapper>
        <h4>Category Performance</h4>
        <p className="no-data">No category data available yet. Start categorizing your jobs!</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h4>Category Performance</h4>
      <div className="category-list">
        {data.map((category, index) => (
          <div key={index} className="category-item">
            <div className="category-header">
              <h5 className="category-name">{category.category}</h5>
              <span className="category-total">{category.total} applications</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-segment pending"
                style={{ width: `${(category.pending / category.total) * 100}%` }}
                title={`Pending: ${category.pending}`}
              />
              <div
                className="progress-segment interview"
                style={{ width: `${(category.interview / category.total) * 100}%` }}
                title={`Interview: ${category.interview}`}
              />
              <div
                className="progress-segment declined"
                style={{ width: `${(category.declined / category.total) * 100}%` }}
                title={`Declined: ${category.declined}`}
              />
            </div>

            <div className="category-stats">
              <div className="stat">
                <span className="stat-label">Pending:</span>
                <span className="stat-value pending">{category.pending}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Interview:</span>
                <span className="stat-value interview">{category.interview}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Declined:</span>
                <span className="stat-value declined">{category.declined}</span>
              </div>
              <div className="stat highlight">
                <span className="stat-label">Interview Rate:</span>
                <span className="stat-value">{category.interviewRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default CategoryPerformance;
