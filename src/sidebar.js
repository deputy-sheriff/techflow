import React, { useEffect, useState } from "react";
import './sidebar.css';
import { BsThreeDots } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { BsGenderFemale } from "react-icons/bs"; // Gender icon
import { CiCalendar } from "react-icons/ci"; // Date of birth icon
import { FaPhoneAlt } from "react-icons/fa";
import { LuShieldCheck } from "react-icons/lu"; // Insurance type icon
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

// Images for stats
const statImages = {
  "Respiratory Rate": require('./Images/respiratory rate.png'),
  "Temperature": require('./Images/temperature.png'),
  "Heart Rate": require('./Images/HeartBPM.png'),
};

// Order of months for the chart
const monthsOrder = [
  { month: "October", year: 2023 },
  { month: "November", year: 2023 },
  { month: "December", year: 2023 },
  { month: "January", year: 2024 },
  { month: "February", year: 2024 },
  { month: "March", year: 2024 },
];

const Sidebar = () => {
  // State for patients and selected patient
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch patients from API on mount
  useEffect(() => {
    const username = 'coalition';
    const password = 'skills-test';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    fetch('https://fedskillstest.coalitiontechnologies.workers.dev/patients', {
      method: 'GET',
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setPatients(data);
        // Default to Jessica Taylor if present, else first patient
        const defaultPatient = data.find(p => p.name === "Jessica Taylor") || data[0];
        setSelectedPatient(defaultPatient);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // Prepare chart data for blood pressure (Oct 2023 to Mar 2024)
  const bpData = monthsOrder.map(({ month, year }) => {
    const entry = selectedPatient?.diagnosis_history?.find(
      d => d.month === month && Number(d.year) === year
    );
    return entry
      ? {
          month: `${month.slice(0,3)}${year === 2024 ? ' 24' : ' 23'}`,
          systolic: entry.blood_pressure.systolic.value,
          diastolic: entry.blood_pressure.diastolic.value,
        }
      : {
          month: `${month.slice(0,3)}${year === 2024 ? ' 24' : ' 23'}`,
          systolic: null,
          diastolic: null,
        };
  });

  // Calculate average systolic and diastolic values (ignore nulls)
  const validBp = bpData.filter(d => d.systolic !== null && d.diastolic !== null);
  const avgSystolic = validBp.length
    ? Math.round(validBp.reduce((sum, d) => sum + d.systolic, 0) / validBp.length)
    : 'N/A';
  const avgDiastolic = validBp.length
    ? Math.round(validBp.reduce((sum, d) => sum + d.diastolic, 0) / validBp.length)
    : 'N/A';

  // Determine if latest values are higher/lower than average
  const latestDiagnosis = selectedPatient?.diagnosis_history?.[0];
  let systolicStatus = "";
  let diastolicStatus = "";
  if (latestDiagnosis && avgSystolic !== 'N/A' && avgDiastolic !== 'N/A') {
    const latestSystolic = latestDiagnosis.blood_pressure.systolic.value;
    const latestDiastolic = latestDiagnosis.blood_pressure.diastolic.value;
    systolicStatus = latestSystolic > avgSystolic ? "Higher than Average" : latestSystolic < avgSystolic ? "Lower than Average" : "Average";
    diastolicStatus = latestDiastolic > avgDiastolic ? "Higher than Average" : latestDiastolic < avgDiastolic ? "Lower than Average" : "Average";
  }

  // Prepare stats for the latest diagnosis
  const stats = latestDiagnosis ? [
    {
      label: "Respiratory Rate",
      value: `${latestDiagnosis.respiratory_rate.value} bpm`,
      color: "#E0F3FA",
      sign: "Normal",
    },
    {
      label: "Temperature",
      value: `${latestDiagnosis.temperature.value}°F`,
      color: "#FFE6E9",
      sign: "Normal",
    },
    {
      label: "Heart Rate",
      value: `${latestDiagnosis.heart_rate.value} bpm`,
      sign: "Lower than Average",
      color: "#FFE6F1",
    },
  ] : [];

  // Prepare contact info for selected patient
  const contactInfo = selectedPatient ? {
    img: selectedPatient.profile_picture,
    name: selectedPatient.name,
    gender: selectedPatient.gender,
    phone: selectedPatient.phone_number,
    dob: selectedPatient.date_of_birth,
    insurance: selectedPatient.insurance_type,
    emergency: selectedPatient.emergency_contact || "N/A",
  } : {};

  // Chart.js data and options for Blood Pressure
  const chartData = {
    labels: bpData.map(d => d.month),
    datasets: [
      {
        label: 'Systolic',
        data: bpData.map(d => d.systolic),
        borderColor: '#E66FD2',
        backgroundColor: 'rgba(230,111,210,0.08)',
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#E66FD2',
        spanGaps: true,
      },
      {
        label: 'Diastolic',
        data: bpData.map(d => d.diastolic),
        borderColor: '#8C6FE6',
        backgroundColor: 'rgba(140,111,230,0.08)',
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#8C6FE6',
        spanGaps: true,
      }
    ]
  };

  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: "#444140", font: { size: 13, weight: 600 } }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: true, color: "#e0e0e0" },
        ticks: { color: "#444140" }
      },
      y: {
        min: 60,
        max: 180,
        ticks: {
          stepSize: 20,
          color: "#444140"
        },
        grid: { display: true, color: "#e0e0e0" }
      }
    }
  };

  return (
    <div className="dashboard-root">
      {/* Patient Box */}
      <div className="dashboard-box patient-box">
        <div className="sidebar-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Patients</span>
          <CiSearch style={{ fontSize: 22, cursor: "pointer" }} />
        </div>
        <div className="patient-list">
          {/* List all patients */}
          {patients.map((p, i) => (
            <div
              className={`dashboard-profile-avatar-block${selectedPatient?.name === p.name ? " selected" : ""}`}
              key={i}
              onClick={() => setSelectedPatient(p)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="dashboard-profile-avatar-img">
                  <img
                    src={p.profile_picture}
                    alt={p.name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#E4BACA',
                      outline: '1.5px white solid',
                    }}
                  />
                </div>
                <div className="dashboard-profile-avatar-details">
                  <div className="dashboard-profile-avatar-name">{p.name}</div>
                  <div className="dashboard-profile-avatar-username">
                    {p.gender}: {p.age}
                  </div>
                </div>
              </div>
              {/* Horizontal three dots icon at the right hand side */}
              <BsThreeDots style={{ marginLeft: 8, color: "#B0B0B0", fontSize: 20 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis History Box */}
      <div className="dashboard-box diagnosis-box">
        <div className="diagnosis-title">Diagnosis History</div>
        {/* Blood Pressure Graph and Averages */}
        <div className="diagnosis-chart-area" style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
          <div style={{ width: 500,  }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, color: "#14213D", paddingLeft: 20 }}>Blood Pressure</div>
            <div style={{ width: 500, height: 200 }}>
              <Line data={chartData} options={chartOptions} width={500} height={200} paddingLeft={20} />
            </div>
          </div>
          {/* Averages box, width 200px */}
          <div className="bp-averages" style={{ width: 200, minWidth: 200, padding: 16, background: "#F4F0FE", borderRadius: 12, marginLeft: 16 }}>
            <div className="bp-averages-custom">
              {/* Systolic */}
              <div className="bp-stat">
                <span className="bp-dot" style={{ background: "#E66FD2" }}></span>
                <strong>Systolic</strong>
                <div className="bp-stat-value">
                  {latestDiagnosis ? latestDiagnosis.blood_pressure.systolic.value : "--"}
                </div>
                <div
                  className="bp-stat-status"
                  style={{
                    color:
                      systolicStatus === "Higher than Average"
                        ? "green"
                        : systolicStatus === "Lower than Average"
                        ? "blue"
                        : "#444140",
                  }}
                >
                  {systolicStatus === "Higher than Average" && "▲ Higher than Average"}
                  {systolicStatus === "Lower than Average" && "▼ Lower than Average"}
                  {systolicStatus === "Average" && "Average"}
                </div>
                <div className="bp-stat-avg">Avg: {avgSystolic}</div>
              </div>
              {/* Diastolic */}
              <div className="bp-stat">
                <span className="bp-dot" style={{ background: "#8C6FE6" }}></span>
                <strong>Diastolic</strong>
                <div className="bp-stat-value">
                  {latestDiagnosis ? latestDiagnosis.blood_pressure.diastolic.value : "--"}
                </div>
                <div
                  className="bp-stat-status"
                  style={{
                    color:
                      diastolicStatus === "Higher than Average"
                        ? "green"
                        : diastolicStatus === "Lower than Average"
                        ? "blue"
                        : "#444140",
                  }}
                >
                  {diastolicStatus === "Higher than Average" && "▲ Higher than Average"}
                  {diastolicStatus === "Lower than Average" && "▼ Lower than Average"}
                  {diastolicStatus === "Average" && "Average"}
                </div>
                <div className="bp-stat-avg">Avg: {avgDiastolic}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Diagnosis stats (Temperature, Heart Rate, Respiratory Rate) */}
        <div className="diagnosis-stats">
          {stats.map((s, i) => (
            <div
              className="diagnosis-stat-box"
              key={i}
              style={{ background: s.color }}
            >
              <img
                src={statImages[s.label]}
                alt={s.label}
                style={{ width: 70, height: 70, marginBottom: 8 }}
              />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-sign" style={{ color: "black" }}>{s.sign}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information Box */}
      <div className="dashboard-box contact-box">
        {selectedPatient && (
          <div className="contact-details">
            {/* Centered profile picture and name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
              <img src={contactInfo.img} alt={contactInfo.name} style={{ width: 100, height: 100, borderRadius: "50%" }} />
              <div className="dashboard-profile-avatar-details" style={{ alignItems: "center", marginTop: 8 }}>
                <div className="dashboard-profile-avatar-name">{contactInfo.name}</div>
              </div>
            </div>
            {/* Contact info rows with header on top and info below */}
            <div className="contact-info-row">
              <div className="contact-info-header">
                <CiCalendar style={{ marginRight: 8 }} />
                Date of Birth
              </div>
              <div className="contact-info-value">{contactInfo.dob}</div>
            </div>
            <div className="contact-info-row">
              <div className="contact-info-header">
                <BsGenderFemale style={{ marginRight: 8 }} />
                Gender
              </div>
              <div className="contact-info-value">{contactInfo.gender}</div>
            </div>
            <div className="contact-info-row">
              <div className="contact-info-header">
                <FaPhoneAlt style={{ marginRight: 8 }} />
                Phone Number
              </div>
              <div className="contact-info-value">{contactInfo.phone}</div>
            </div>
            <div className="contact-info-row">
              <div className="contact-info-header">
                <FaPhoneAlt style={{ marginRight: 8 }} />
                Emergency Contact
              </div>
              <div className="contact-info-value">{contactInfo.emergency}</div>
            </div>
            <div className="contact-info-row">
              <div className="contact-info-header">
                <LuShieldCheck style={{ marginRight: 8 }} />
                Insurance Type
              </div>
              <div className="contact-info-value">{contactInfo.insurance}</div>
            </div>
            {/* Show All Information Button */}
            <button
              className="show-all-info-btn"
              style={{
                marginTop: 16,
                width: "100%",
                background: "#01F0D0",
                color: "#14213D",
                border: "none",
                borderRadius: 20,
                padding: "12px 0",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              Show All Information
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

