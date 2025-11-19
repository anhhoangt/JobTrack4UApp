import styled from 'styled-components';

const Wrapper = styled.div`
  .no-resumes {
    background: var(--grey-50);
    border: 2px dashed var(--grey-300);
    border-radius: var(--borderRadius);
    padding: 2rem;
    text-align: center;
    margin: 1rem 0;

    p {
      color: var(--grey-600);
      margin: 0;
      font-style: italic;
    }
  }

  .resumes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .resume-card {
    background: var(--white);
    border: 2px solid var(--grey-200);
    border-radius: var(--borderRadius);
    padding: 1.5rem;
    position: relative;
    transition: var(--transition);

    &:hover {
      box-shadow: var(--shadow-2);
      border-color: var(--primary-300);
    }

    &.default {
      border-color: var(--primary-500);
      background: linear-gradient(to bottom, var(--primary-50) 0%, var(--white) 100%);
    }
  }

  .default-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--primary-500);
    color: var(--white);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .resume-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-right: 5rem; /* Space for default badge */
  }

  .file-icon {
    font-size: 2.5rem;
    flex-shrink: 0;

    &.pdf {
      color: var(--red-dark);
    }

    &.word {
      color: #2b579a;
    }
  }

  .resume-info {
    flex: 1;
    min-width: 0;
  }

  .resume-filename {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--grey-700);
    word-break: break-word;
  }

  .resume-category {
    display: inline-block;
    background: var(--grey-100);
    color: var(--grey-700);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .resume-meta {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--grey-200);
  }

  .upload-date {
    font-size: 0.875rem;
    color: var(--grey-500);
  }

  .resume-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--borderRadius);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    text-decoration: none;
    flex: 0 1 auto;
    white-space: nowrap;

    &.download {
      background: var(--primary-500);
      color: var(--white);

      &:hover {
        background: var(--primary-700);
      }
    }

    &.set-default {
      background: var(--grey-100);
      color: var(--grey-700);

      &:hover {
        background: var(--primary-100);
        color: var(--primary-700);
      }
    }

    &.edit {
      background: var(--grey-100);
      color: var(--grey-700);

      &:hover {
        background: var(--grey-200);
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
    .resumes-grid {
      grid-template-columns: 1fr;
    }

    .resume-actions {
      flex-direction: column;

      .action-btn {
        flex: 1;
        justify-content: center;
      }
    }

    .resume-header {
      padding-right: 0;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .default-badge {
      position: static;
      margin-bottom: 1rem;
    }
  }
`;

export default Wrapper;
