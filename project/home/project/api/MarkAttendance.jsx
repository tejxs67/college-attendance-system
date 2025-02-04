import React, { useState } from 'react';
import axios from 'axios';

const MarkAttendance = () => {
  const [classId, setClassId] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/mark_attendance.php', { class_id: classId }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error occurred');
    }
  };

  return (
    <div>
      <h1>Mark Attendance</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Class ID:
          <input
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {response && <div>Success: {JSON.stringify(response)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </div>
  );
};

export default MarkAttendance;