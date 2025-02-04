import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendanceStats = () => {
  const [period, setPeriod] = useState('all');
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/student_attendance_stats.php?period=${period}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response ? err.response.data : 'Error occurred');
      }
    };

    fetchStats();
  }, [period]);

  return (
    <div>
      <h1>Student Attendance Statistics</h1>
      <div>
        <label>
          Period:
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="all">All</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </label>
      </div>
      {error && <div>Error: {JSON.stringify(error)}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance</th>
            <th>Attendance Percentage</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat, index) => (
            <tr key={index}>
              <td>{stat.name}</td>
              <td>{stat.attendance}</td>
              <td>{stat.attendance_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAttendanceStats;