import main from "../assets/images/main-alternative.svg";
import barchart from "../assets/images/barchart.PNG";
import searchengine from "../assets/images/searchengine.PNG";
import areachart from "../assets/images/areachart.PNG";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import React from "react";

const Landing = () => {
  const { user } = useAppContext();
  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/* info */}
          <div className="info">
            <h1>
              job <span>tracking</span> app
            </h1>
            <p>
              Whether you're actively searching for a new job or just exploring
              your options, JobTrack4U is the perfect tool to help you stay
              organized and motivated. So why wait? Sign up for JobTrack4U today
              and start taking control of your job search! 
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
        <div className="feature">
          <h2>Interesting Features:</h2>
          <hr></hr>
          <div className="searchEngine">            
            <img src={searchengine} alt="Purpose" className="img searchEngine-img" />  
            <div>        
            <h4>Responsive Search Engine</h4>
            <h5>
            User can search for jobs by keywords, status, and job type by a responsive search engine.
            </h5>  
            </div>            
          </div>
          <div className="barchart">
            <div>
              <h4>Dynamic Charts</h4>
              <h5>
              User can also see how many jobs they apply in the last 6 active months with dynamic barchart.
              </h5>
            </div>            
            <img src={barchart} alt="Purpose" className="img barchart-img" />            
          </div>
          <div className="areachart">            
            <img src={areachart} alt="Purpose" className="img areachart-img" />
            <div>
              <h5>Or areachart.</h5>
            </div>
          </div>
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Landing;
