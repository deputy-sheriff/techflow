import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './test.css';
import { GoHome } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";
import { FiMessageSquare } from "react-icons/fi";
import { MdCreditCard } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs"; // Import the three dots icon

// Doctor profile information
const doctorProfile = {
  name: "Dr. John Doe",
  role: "General Practitioner",
  avatar: require('./Images/senior-woman-doctor-and-portrait-smile-for-health-2023-11-27-05-18-16-utc.png'), // Use your actual doctor image
};

const Testing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine the active navigation link
  const getActive = (path) => (
    location.pathname === path ? "navbar-link active" : "navbar-link"
  );

  return (
    <div className="navbar">
      {/* Logo section */}
      <div className="navbar-logo-area">
        <img src={require('./Images/TestLogo.png')} alt="Logo" />
      </div>
      {/* Navigation links */}
      <div className="navbar-links">
        <div className={getActive("/Overview")} onClick={() => navigate("/Overview")}>
          <GoHome /> {/* Home icon */}
          Overview
        </div>
        <div className={getActive("/Patient")} onClick={() => navigate("/Patient")}>
          <HiOutlineUsers /> {/* Patient icon */}
          Patient
        </div>
        <div className={getActive("/Schedule")} onClick={() => navigate("/Schedule")}>
          <CiCalendar /> {/* Schedule icon */}
          Schedule
        </div>
        <div className={getActive("/Message")} onClick={() => navigate("/Message")}>
          <FiMessageSquare /> {/* Message icon */}
          Message
        </div>
        <div className={getActive("/Transaction")} onClick={() => navigate("/Transaction")}>
          <MdCreditCard /> {/* Transaction icon */}
          Transaction
        </div>
      </div>
      {/* Doctor profile and settings */}
      <div className="navbar-profile">
        <img
          src={doctorProfile.avatar}
          alt={doctorProfile.name}
          className="navbar-profile-avatar"
        />
        <div className="navbar-profile-details">
          <div className="navbar-profile-name">{doctorProfile.name}</div>
          <div className="navbar-profile-role">{doctorProfile.role}</div>
        </div>
        {/* Three dots icon after settings */}
        <FiSettings style={{ marginRight: 8 }} /> {/* Settings icon */}
        <BsThreeDotsVertical style={{ marginRight: 8, fontSize: 20 }} />
        
      </div>
    </div>
  );
};

export default Testing;