import React, { useEffect, useState } from "react";
import "./Home.css";
import {
  BarChart,
  Bar,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  XAxis,
} from "recharts";

// Custom Legend
const CustomLegend = ({ data }) => (
  <ul style={{ listStyle: "none", padding: 0, marginLeft: 3 }}>
    {data.map((item, index) => (
      <li key={index} style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
        <span
          style={{
            width: 14,
            height: 14,
            backgroundColor: item.color,
            display: "inline-block",
            marginRight: 10,
            borderRadius: 3,
          }}
        ></span>
        {item.name}
      </li>
    ))}
  </ul>
);

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 6,
          padding: "10px 15px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
          fontSize: 14,
        }}
      >
        <strong>{name}</strong>
        <br />
        Valeur : <span style={{ fontWeight: 500 }}>{value}</span>
      </div>
    );
  }

  return null;
};

const Home = () => {
  const [stats, setStats] = useState({
    average: 0,
    min: 0,
    max: 0,
    count: 0,
  });

  // Fetch statistics initially and every 5 seconds
  useEffect(() => {
    const fetchStats = () => {
      fetch("http://localhost:5000/api/statistics")
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error("Erreur de récupération des stats:", err));
    };

    fetchStats(); // Initial fetch
    const interval = setInterval(fetchStats, 5000); // Poll every 5 sec

    return () => clearInterval(interval); // Cleanup
  }, []);

  const data = [
    { name: "Moyenne Générale", value: parseFloat(stats.average), color: "#ffeb3b" },
    { name: "Moyenne Minimale", value: parseFloat(stats.min), color: "#dc3545" },
    { name: "Moyenne Maximale", value: parseFloat(stats.max), color: "#28a745" },
  ];

  return (
    <div className="home-page">
      <h1>Statistiques Générales</h1>
      <div className="chart-container" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="80%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              barCategoryGap="15%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} axisLine={false} />
              <YAxis domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" barSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ textAlign: "center", marginTop: "10px", fontWeight: "bold", fontSize: "20px" }}>
            Histogramme des moyennes
          </div>
        </div>

        <div style={{ width: 200 }}>
          <CustomLegend data={data} />
          <div style={{ marginTop: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
              Effectif Total
            </label>
            <input
              type="text"
              value={stats.count}
              readOnly
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#f9f9f9",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
