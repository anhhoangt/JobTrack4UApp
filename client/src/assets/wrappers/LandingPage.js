import styled from 'styled-components'

const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }

  .feature {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;

    .searchEngine {
      padding-top: 1rem;
      padding-bottom: 5rem;
      padding-left: 5rem;
      padding-right: 5rem;
      display: flex;
      grid-column-gap: 5rem;
    }

    .barchart {
      padding-top: 1rem;
      padding-bottom: 5rem;
      padding-left: 5rem;
      padding-right: 5rem;
      display: flex;
      grid-column-gap: 5rem;
    }

    .areachart {
      padding-top: 1rem;
      padding-bottom: 5rem;
      padding-left: 5rem;
      padding-right: 5rem;
      display: flex;
      grid-column-gap: 5rem;
    }

    .confirmEmail {
      padding-top: 1rem;
      padding-bottom: 5rem;
      padding-left: 5rem;
      padding-right: 5rem;
      display: flex;
      grid-column-gap: 5rem;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      margin-top: 2rem;
      font-weight: 700;
    }

    h4 {
      font-weight: 300;
      font-size: 2rem;
    }

    p{
      font-weight: 50;
      font-size: 1rem;
    }
  
    .searchEngine-img {
      max-width: 60%;
    }

    .barchart-img {
      max-width: 60%;
      height: 150%;
    }
    .areachart-img {
      max-width: 60%;
      height: 150%;
    }
    .confirmEmail-img {
      max-width: 60%;
      height: 150%;
    }
  }

  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`
export default Wrapper
