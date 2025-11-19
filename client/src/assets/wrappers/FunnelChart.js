import styled from 'styled-components';

const Wrapper = styled.div`
  background: var(--white);
  border-radius: var(--borderRadius);
  padding: 2rem;
  box-shadow: var(--shadow-2);

  h4 {
    margin: 0 0 2rem 0;
    text-align: center;
    color: var(--grey-700);
  }

  .funnel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .funnel-stage {
    transition: all 0.3s ease;
    min-width: 200px;
  }

  .stage-bar {
    padding: 1rem 1.5rem;
    border-radius: var(--borderRadius);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--white);
    font-weight: 600;
    box-shadow: var(--shadow-2);

    &.applied {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    }

    &.responded {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    &.interviewing {
      background: linear-gradient(135deg, #10b981, #059669);
    }
  }

  .stage-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stage-count {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stage-percentage {
    text-align: center;
    color: var(--grey-600);
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  .funnel-arrow {
    color: var(--grey-400);
    font-size: 1.5rem;
    margin: 0.25rem 0;
  }

  .funnel-insights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--grey-200);
  }

  .insight {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .insight-label {
    font-size: 0.875rem;
    color: var(--grey-600);
  }

  .insight-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-500);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .funnel-stage {
      width: 100% !important;
      min-width: unset;
    }

    .stage-bar {
      padding: 0.875rem 1rem;
    }

    .stage-count {
      font-size: 1.25rem;
    }
  }
`;

export default Wrapper;
