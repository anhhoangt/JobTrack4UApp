import styled from 'styled-components';

const Wrapper = styled.section`
  h2 {
    text-transform: none;
    margin-bottom: 2rem;
    color: var(--grey-700);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .chart-container {
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 2rem;
    box-shadow: var(--shadow-2);

    h4 {
      margin: 0 0 2rem 0;
      text-align: center;
      color: var(--grey-700);
    }
  }

  .job-type-container {
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 2rem;
    box-shadow: var(--shadow-2);

    h4 {
      margin: 0 0 1.5rem 0;
      text-align: center;
      color: var(--grey-700);
    }
  }

  .job-type-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .job-type-item {
    border: 1px solid var(--grey-200);
    border-radius: var(--borderRadius);
    padding: 1rem;
    transition: var(--transition);

    &:hover {
      box-shadow: var(--shadow-2);
      border-color: var(--primary-300);
    }
  }

  .job-type-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .job-type-name {
    font-weight: 600;
    color: var(--grey-700);
    text-transform: capitalize;
  }

  .job-type-count {
    font-size: 0.875rem;
    color: var(--grey-500);
  }

  .job-type-bar {
    height: 10px;
    background: var(--grey-100);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .job-type-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    transition: width 0.3s ease;
  }

  .job-type-percentage {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-500);
  }

  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .chart-container,
    .job-type-container {
      padding: 1.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
`;

export default Wrapper;
