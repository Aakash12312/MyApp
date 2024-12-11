import React from "react";
import "./TeamPage.css";

const teamMembers = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    name: "Akshara",
    college: "KMIT",
    description: "",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150",
    name: "Shraddha",
    college: "KMIT",
    description: "",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/150",
    name: "Amulya",
    college: "KMIT",
    description: "",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/150",
    name: "Nischala",
    college: "KMIT",
    description: "",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/150",
    name: "Keerthana",
    college: "KMIT",
    description: "",
  },
  {
    id: 6,
    image: "https://via.placeholder.com/150",
    name: "Sriteja",
    college: "KMIT",
    description: "",
  },
  {
    id: 7,
    image: "https://via.placeholder.com/150",
    name: "Aakash",
    college: "KMIT",
    description: "",
  },
];

const TeamPage = () => {
  return (
    <div className="team-page-wrapper">
      <header>
        <h1>Our Team</h1>
      </header>
      <div className="team-page">
        <div className="card-container">
          {teamMembers.map((member) => (
            <div key={member.id} className="card">
              <img src={member.image} alt={member.name} />
              <h2>{member.name}</h2>
              <p className="college">{member.college}</p>
              <p className="description">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
