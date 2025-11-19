import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 2rem 0;

  .ai-header {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    color: var(--white);
    padding: 2rem;
    border-radius: var(--borderRadius);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-3);
  }

  .header-content h2 {
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 2rem;
  }

  .header-content p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .tab {
    padding: 1rem 1.5rem;
    background: var(--white);
    border: 2px solid var(--grey-200);
    border-radius: var(--borderRadius);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: var(--grey-700);
    white-space: nowrap;

    &:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
    }

    &.active {
      background: var(--primary-500);
      color: var(--white);
      border-color: var(--primary-500);
    }

    svg {
      font-size: 1.2rem;
    }
  }

  /* Tab Content */
  .tab-content {
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 2rem;
    box-shadow: var(--shadow-2);
  }

  .feature-section h3 {
    margin: 0 0 0.5rem 0;
    color: var(--grey-700);
    font-size: 1.75rem;
  }

  .feature-description {
    color: var(--grey-600);
    margin-bottom: 2rem;
    font-size: 1.05rem;
  }

  /* Input Groups */
  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--grey-700);
  }

  /* Input Method Selector */
  .input-method-selector {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .method-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    background: var(--grey-100);
    border: 2px solid var(--grey-300);
    border-radius: var(--borderRadius);
    cursor: pointer;
    font-weight: 500;
    transition: var(--transition);
    color: var(--grey-700);

    &:hover {
      background: var(--grey-200);
    }

    &.active {
      background: var(--primary-100);
      border-color: var(--primary-500);
      color: var(--primary-700);
    }
  }

  /* File Upload */
  .file-upload-container {
    border: 2px dashed var(--grey-300);
    border-radius: var(--borderRadius);
    padding: 2rem;
    text-align: center;
    background: var(--grey-50);
  }

  .file-upload-btn {
    display: inline-block;
    padding: 1rem 2rem;
    background: var(--primary-500);
    color: var(--white);
    border-radius: var(--borderRadius);
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);

    &:hover {
      background: var(--primary-700);
    }
  }

  .file-selected {
    margin-top: 1rem;
    color: var(--green-dark);
    font-weight: 500;
  }

  /* URL Input */
  .url-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .url-input-group {
    display: flex;
    gap: 0.5rem;
  }

  .url-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid var(--grey-300);
    border-radius: var(--borderRadius);
    font-size: 0.95rem;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(37, 87, 167, 0.1);
    }
  }

  .fetch-btn {
    padding: 0.75rem 1.5rem;
    background: var(--primary-500);
    color: var(--white);
    border: none;
    border-radius: var(--borderRadius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: var(--primary-700);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .url-hint {
    color: var(--grey-500);
    font-size: 0.875rem;
    font-style: italic;
  }

  .input-group textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--grey-300);
    border-radius: var(--borderRadius);
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.6;
    resize: vertical;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(37, 87, 167, 0.1);
    }

    &::placeholder {
      color: var(--grey-400);
    }
  }

  .input-group input[type="text"] {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--grey-300);
    border-radius: var(--borderRadius);
    font-family: inherit;
    font-size: 0.95rem;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(37, 87, 167, 0.1);
    }
  }

  /* Buttons */
  .btn-primary {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    color: var(--white);
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--borderRadius);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Result Section */
  .result-section {
    margin-top: 2rem;
    border: 2px solid var(--primary-200);
    border-radius: var(--borderRadius);
    overflow: hidden;
    background: var(--primary-50);
  }

  .result-header {
    background: var(--primary-100);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--primary-200);
  }

  .result-header h4 {
    margin: 0;
    color: var(--primary-700);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .result-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-icon {
    background: var(--white);
    color: var(--primary-600);
    border: 1px solid var(--primary-300);
    padding: 0.5rem 1rem;
    border-radius: var(--borderRadius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: var(--transition);

    &:hover {
      background: var(--primary-500);
      color: var(--white);
      border-color: var(--primary-500);
    }

    svg {
      font-size: 1rem;
    }
  }

  .result-content {
    padding: 1.5rem;
    background: var(--white);
    white-space: pre-wrap;
    line-height: 1.8;
    font-size: 0.95rem;
    max-height: 600px;
    overflow-y: auto;
    color: var(--grey-800);

    &.markdown {
      font-family: 'Georgia', serif;

      h2, h3 {
        color: var(--primary-700);
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }

      ul, ol {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
      }

      li {
        margin-bottom: 0.5rem;
      }

      p {
        margin-bottom: 1rem;
      }

      strong {
        color: var(--grey-900);
      }
    }
  }

  /* Scrollbar */
  .result-content::-webkit-scrollbar {
    width: 8px;
  }

  .result-content::-webkit-scrollbar-track {
    background: var(--grey-100);
  }

  .result-content::-webkit-scrollbar-thumb {
    background: var(--primary-300);
    border-radius: 4px;
  }

  .result-content::-webkit-scrollbar-thumb:hover {
    background: var(--primary-500);
  }

  /* Responsive */
  @media (max-width: 768px) {
    padding: 1rem 0;

    .ai-header {
      padding: 1.5rem;
    }

    .header-content h2 {
      font-size: 1.5rem;
    }

    .header-content p {
      font-size: 0.95rem;
    }

    .tabs {
      flex-direction: column;
    }

    .tab {
      width: 100%;
      justify-content: center;
    }

    .tab-content {
      padding: 1.5rem;
    }

    .feature-section h3 {
      font-size: 1.4rem;
    }

    .result-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .result-actions {
      width: 100%;
      flex-direction: column;
    }

    .btn-icon {
      width: 100%;
      justify-content: center;
    }
  }
`;

export default Wrapper;
