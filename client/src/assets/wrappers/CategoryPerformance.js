import styled from 'styled-components';

const Wrapper = styled.div`
  background: var(--white);
  border-radius: var(--borderRadius);
  padding: 2rem;
  box-shadow: var(--shadow-2);

  h4 {
    margin: 0 0 1.5rem 0;
    text-align: center;
    color: var(--grey-700);
  }

  .no-data {
    text-align: center;
    color: var(--grey-500);
    padding: 2rem;
    font-style: italic;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .category-item {
    border: 1px solid var(--grey-200);
    border-radius: var(--borderRadius);
    padding: 1.25rem;
    transition: var(--transition);

    &:hover {
      box-shadow: var(--shadow-2);
      border-color: var(--primary-300);
    }
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .category-name {
    margin: 0;
    font-size: 1rem;
    color: var(--grey-700);
    text-transform: capitalize;
    font-weight: 600;
  }

  .category-total {
    font-size: 0.875rem;
    color: var(--grey-500);
    font-weight: 500;
  }

  .progress-bar {
    height: 12px;
    background: var(--grey-100);
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    margin-bottom: 1rem;
  }

  .progress-segment {
    height: 100%;
    transition: all 0.3s ease;

    &.pending {
      background: #fbbf24;
    }

    &.interview {
      background: #10b981;
    }

    &.declined {
      background: #ef4444;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  .category-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &.highlight {
      background: var(--primary-50);
      padding: 0.5rem;
      border-radius: 4px;
    }
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--grey-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--grey-900);

    &.pending {
      color: #f59e0b;
    }

    &.interview {
      color: #10b981;
    }

    &.declined {
      color: #ef4444;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .category-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .category-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-value {
      font-size: 1rem;
    }
  }
`;

export default Wrapper;
