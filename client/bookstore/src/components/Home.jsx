//  import React from "react";
import '../css/Home.css'
// import logo from './public/Image/BookStor.png'

const Home = () => {
  console.log();
  return (
    <div className="hero"> 
    <div className="hero-content">
      <h1 className="hero-text">Book Store</h1>
      <p className="hero-discription">
        Browse the collection of our best interesting books.
         You will definitely find what you are looking for.
      </p>
    </div>
      <div className="hero-image">
      {/* <img>{logo}</img> */}
      </div>
    </div>
  );
}

export default Home;
  