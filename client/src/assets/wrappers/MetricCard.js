import styled from 'styled-components';

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  border-bottom: 5px solid ${props => props.color || 'var(--primary-500)'};
  padding: 2rem;
  box-shadow: var(--shadow-2);
  transition: var(--transition);

  &:hover {
    box-shadow: var(--shadow-4);
    transform: translateY(-2px);
  }

  header {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .icon-container {
    width: 60px;
    height: 60px;
    background: ${props => props.color || 'var(--primary-500)'};
    border-radius: var(--borderRadius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: var(--white);
    flex-shrink: 0;
  }

  .info {
    flex: 1;
  }

  h5 {
    margin: 0;
    text-transform: none;
    letter-spacing: 0;
    color: var(--grey-500);
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .value-container {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--grey-900);
    line-height: 1;
  }

  .subtitle {
    font-size: 1rem;
    color: var(--grey-500);
    font-weight: 400;
  }

  .trend {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: inline-block;

    &.up {
      color: var(--green-dark);
      background: var(--green-light);
    }

    &.down {
      color: var(--red-dark);
      background: var(--red-light);
    }

    &.neutral {
      color: var(--grey-600);
      background: var(--grey-100);
    }
  }

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .value {
      font-size: 1.75rem;
    }
  }
`;

export default Wrapper;
