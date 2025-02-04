<?php
$stmt = $pdo->prepare("
    SELECT c.*, s.name as subject_name 
    FROM classes c 
    JOIN subjects s ON c.subject_id = s.id 
    WHERE c.is_active = true
");
$stmt->execute();
$activeClasses = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("
    SELECT class_id 
    FROM attendance 
    WHERE student_id = ?
");
$stmt->execute([$_SESSION['user']['id']]);
$markedAttendance = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'class_id');
?>

<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Active Classes -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Active Classes
            </h2>
            <div class="space-y-3">
                <?php foreach ($activeClasses as $class): ?>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div>
                        <p class="font-medium text-gray-900">
                            <?= htmlspecialchars($class['subject_name']) ?>
                        </p>
                        <p class="text-sm text-gray-500">
                            Room: <?= htmlspecialchars($class['room_code']) ?>
                        </p>
                        <p class="text-xs text-gray-400">
                            <?= date('M j, Y g:i A', strtotime($class['date'])) ?>
                        </p>
                    </div>
                    <?php if (in_array($class['id'], $markedAttendance)): ?>
                        <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    <?php else: ?>
                        <button onclick="markAttendance('<?= $class['id'] ?>')"
                                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            Mark Present
                        </button>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
                <?php if (empty($activeClasses)): ?>
                    <p class="text-gray-500 text-center py-4">
                        No active classes at the moment
                    </p>
                <?php endif; ?>
            </div>
        </div>

        <!-- Attendance Chart -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Attendance by Subject
            </h2>
            <div class="h-64">
                <canvas id="subjectAttendanceChart"></canvas>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    fetch('api/student_attendance_stats.php')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('subjectAttendanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        label: 'Classes Attended',
                        data: data.map(item => item.attendance),
                        backgroundColor: '#4F46E5'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });
});

function markAttendance(classId) {
    fetch('api/mark_attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class_id: classId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert('Failed to mark attendance: ' + data.error);
        }
    });
}
</script>