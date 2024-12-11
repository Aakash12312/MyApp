// import React from "react";

// function HeroSection() {
//   return (
//     <div className="bg-teal-100 text-center py-20">
//       <h1 className="text-4xl font-bold mb-4">Welcome to THOUGHTLY</h1>
//       <p className="text-lg mb-8">
//         Your go-to destination for thoughtful and inspiring ideas. </p>
//         <h3>Explore the art of thoughtful living, nurture your mind, and elevate your thinking.</h3>
//         <h3>We Help you create high quality blog content.</h3>
//         <h3>Start your Journey today!</h3>
//       <button className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-teal-500">
//         Start Your Journey
//       </button>
//     </div>
//   );
// }

// export default HeroSection;
import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom

function HeroSection() {
  const navigate = useNavigate(); // Initialize navigate function

  const handleButtonClick = () => {
    navigate("/user/login"); // Redirect to the login page when the button is clicked
  };

  return (
    <div className="main-content">
      <h1>Welcome to THOUGHTLY</h1>
      <p>Your go-to destination for thoughtful and inspiring ideas.</p>
      <p>Explore the art of thoughtful living, nurture your mind, and elevate your thinking.</p>
      <p>We help you create high-quality blog content.</p>
      <p>Start your journey today!</p>
      <button className="start-journey-button" onClick={handleButtonClick}>
        Start Your Journey
      </button>
    </div>
  );
}

export default HeroSection;


