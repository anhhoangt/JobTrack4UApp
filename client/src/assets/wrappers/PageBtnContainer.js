import styled from 'styled-components'

const Wrapper = styled.section`
  height: 6rem;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;
  .btn-container {
    background: var(--primary-100);
    border-radius: var(--borderRadius);
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
  }
  .pageBtn {
    background: transparent;
    border-color: transparent;
    border: none;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    transition: var(--transition);
    border-radius: var(--borderRadius);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    line-height: 40px;
    vertical-align: middle;
  }
  .active {
    background: var(--primary-500);
    color: var(--white);
  }
  .page-ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 40px;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary-500);
    line-height: 40px;
    vertical-align: middle;
  }
  .prev-btn,
  .next-btn {
    width: 100px;
    height: 40px;
    background: var(--white);
    border-color: transparent;
    border: none;
    border-radius: var(--borderRadius);
    color: var(--primary-500);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: var(--transition);
    padding: 0;
    margin: 0;
    line-height: 40px;
    vertical-align: middle;
  }
  .prev-btn:hover,
  .next-btn:hover {
    background: var(--primary-500);
    color: var(--white);
  }
  .prev-btn:disabled,
  .next-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .prev-btn:disabled:hover,
  .next-btn:disabled:hover {
    background: var(--white);
    color: var(--primary-500);
  }
`
export default Wrapper
