import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 2rem 0;

  .templates-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 2rem;
  }

  .header-content h2 {
    margin: 0 0 0.5rem 0;
    color: var(--grey-700);
  }

  .header-content p {
    margin: 0;
    color: var(--grey-500);
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
  }

  .filter-section {
    background: var(--white);
    padding: 1.5rem;
    border-radius: var(--borderRadius);
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow-2);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--grey-300);
    border-radius: var(--borderRadius);
    background: var(--white);
    font-size: 0.875rem;
  }

  .template-count {
    color: var(--grey-600);
    font-weight: 500;
  }

  .no-templates {
    background: var(--grey-50);
    border: 2px dashed var(--grey-300);
    border-radius: var(--borderRadius);
    padding: 4rem 2rem;
    text-align: center;

    p {
      margin-bottom: 1.5rem;
      color: var(--grey-600);
    }
  }

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .template-card {
    background: var(--white);
    border: 2px solid var(--grey-200);
    border-radius: var(--borderRadius);
    padding: 1.5rem;
    transition: var(--transition);

    &:hover {
      box-shadow: var(--shadow-3);
      border-color: var(--primary-300);
    }

    &.favorite {
      border-color: var(--primary-500);
    }
  }

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    h4 {
      margin: 0 0 0.5rem 0;
      color: var(--grey-700);
    }
  }

  .template-type {
    display: inline-block;
    background: var(--primary-100);
    color: var(--primary-700);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .favorite-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--grey-300);
    transition: var(--transition);

    &:hover, &.active {
      color: #fbbf24;
    }
  }

  .template-subject {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: var(--grey-50);
    border-radius: var(--borderRadius);
    font-size: 0.875rem;
  }

  .template-description {
    color: var(--grey-600);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .template-content-preview {
    background: var(--grey-50);
    padding: 1rem;
    border-radius: var(--borderRadius);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--grey-700);
    margin-bottom: 1rem;
    border-left: 3px solid var(--primary-500);
  }

  .template-variables {
    margin-bottom: 1rem;

    strong {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: var(--grey-700);
    }
  }

  .variables-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .variable-tag {
    background: var(--grey-100);
    color: var(--primary-700);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-family: monospace;
  }

  .more-variables {
    color: var(--grey-500);
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .template-meta {
    display: flex;
    gap: 0.5rem;
    color: var(--grey-500);
    font-size: 0.75rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--grey-200);
  }

  .template-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--borderRadius);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    text-decoration: none;
    display: inline-block;

    &.view {
      background: var(--primary-500);
      color: var(--white);

      &:hover {
        background: var(--primary-700);
      }
    }

    &.edit {
      background: var(--grey-100);
      color: var(--grey-700);

      &:hover {
        background: var(--grey-200);
      }
    }

    &.duplicate {
      background: var(--grey-100);
      color: var(--grey-700);

      &:hover {
        background: var(--primary-100);
        color: var(--primary-700);
      }
    }

    &.delete {
      background: var(--red-light);
      color: var(--red-dark);

      &:hover {
        background: var(--red-dark);
        color: var(--white);
      }
    }
  }

  @media (max-width: 768px) {
    .templates-header {
      flex-direction: column;
    }

    .templates-grid {
      grid-template-columns: 1fr;
    }

    .filter-section {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }
`;

export default Wrapper;
