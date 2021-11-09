// import closeUp from '/images/closeUp.JPG'
import React  from 'react';
import '../styles/loader.css';

const Loader = ({loading}) => {
    return (
        <section className={"specialLoader"} style={{display: loading ? "inline-flex": "none"}}>
            <div className={"loadingAnim"}>

            </div>
        </section>
    );
  };


export default Loader;