// WebSocket Connection
const ws = new WebSocket(`ws://${WS_HOST}:${WS_PORT}`);

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'attendance_update') {
        // Refresh the relevant parts of the UI
        location.reload();
    }
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Modal handling
function showNewSubjectModal() {
    // Implementation for showing new subject modal
}

function showNewClassModal() {
    // Implementation for showing new class modal
}

// Attendance marking with WebSocket notification
async function markAttendance(classId) {
    try {
        const response = await fetch('api/mark_attendance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ class_id: classId })
        });
        const data = await response.json();
        
        if (data.success) {
            ws.send(JSON.stringify({
                type: 'attendance_marked',
                class_id: classId
            }));
            location.reload();
        } else {
            alert('Failed to mark attendance: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to mark attendance');
    }
}