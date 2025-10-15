import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 4rem;
  text-align: center;

  h4 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: var(--grey-700);
  }

  .chart-toggle-btn {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
    color: var(--white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    text-transform: capitalize;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;
    margin-bottom: 2rem;
    letter-spacing: 0.5px;
  }

  .chart-toggle-btn:hover {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    transform: translateY(-2px);
  }

  .chart-toggle-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }

  .chart-toggle-btn svg {
    font-size: 1.1rem;
  }
`

export default Wrapper
