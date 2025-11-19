import Wrapper from '../assets/wrappers/FunnelChart';

const FunnelChart = ({ data }) => {
  const { applied, responded, interviewing } = data;

  const maxWidth = 100;
  const respondedWidth = applied > 0 ? (responded / applied) * maxWidth : 0;
  const interviewingWidth = applied > 0 ? (interviewing / applied) * maxWidth : 0;

  const responseRate = applied > 0 ? ((responded / applied) * 100).toFixed(1) : 0;
  const interviewRate = applied > 0 ? ((interviewing / applied) * 100).toFixed(1) : 0;

  return (
    <Wrapper>
      <h4>Application Funnel</h4>
      <div className="funnel-container">
        <div className="funnel-stage" style={{ width: `${maxWidth}%` }}>
          <div className="stage-bar applied">
            <span className="stage-label">Applied</span>
            <span className="stage-count">{applied}</span>
          </div>
          <div className="stage-percentage">100%</div>
        </div>

        <div className="funnel-arrow">↓</div>

        <div className="funnel-stage" style={{ width: `${respondedWidth}%` }}>
          <div className="stage-bar responded">
            <span className="stage-label">Responded</span>
            <span className="stage-count">{responded}</span>
          </div>
          <div className="stage-percentage">{responseRate}%</div>
        </div>

        <div className="funnel-arrow">↓</div>

        <div className="funnel-stage" style={{ width: `${interviewingWidth}%` }}>
          <div className="stage-bar interviewing">
            <span className="stage-label">Interviewing</span>
            <span className="stage-count">{interviewing}</span>
          </div>
          <div className="stage-percentage">{interviewRate}%</div>
        </div>
      </div>

      <div className="funnel-insights">
        <div className="insight">
          <span className="insight-label">Drop-off Rate:</span>
          <span className="insight-value">{(100 - parseFloat(responseRate)).toFixed(1)}%</span>
        </div>
        <div className="insight">
          <span className="insight-label">Conversion to Interview:</span>
          <span className="insight-value">{interviewRate}%</span>
        </div>
      </div>
    </Wrapper>
  );
};

export default FunnelChart;
