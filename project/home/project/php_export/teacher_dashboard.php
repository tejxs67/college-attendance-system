<?php
$stmt = $pdo->prepare("
    SELECT s.*, p.full_name as teacher_name 
    FROM subjects s 
    JOIN profiles p ON s.teacher_id = p.id 
    WHERE s.teacher_id = ?
");
$stmt->execute([$_SESSION['user']['id']]);
$subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("
    SELECT c.*, s.name as subject_name 
    FROM classes c 
    JOIN subjects s ON c.subject_id = s.id 
    WHERE c.created_by = ? AND c.is_active = true
");
$stmt->execute([$_SESSION['user']['id']]);
$activeClasses = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Subjects Section -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Subjects</h2>
                <button onclick="showNewSubjectModal()" 
                        class="p-2 text-indigo-600 hover:text-indigo-700">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </div>
            <div class="space-y-3">
                <?php foreach ($subjects as $subject): ?>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                        <p class="font-medium text-gray-900"><?= htmlspecialchars($subject['name']) ?></p>
                        <p class="text-sm text-gray-500">Code: <?= htmlspecialchars($subject['code']) ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Active Classes Section -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Active Classes</h2>
                <button onclick="showNewClassModal()" 
                        class="p-2 text-indigo-600 hover:text-indigo-700">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </div>
            <div class="space-y-3">
                <?php foreach ($activeClasses as $class): ?>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                        <p class="font-medium text-gray-900">
                            Room: <?= htmlspecialchars($class['room_code']) ?>
                        </p>
                        <p class="text-sm text-gray-500">
                            <?= date('M j, Y g:i A', strtotime($class['date'])) ?>
                        </p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Attendance Chart -->
        <div class="bg-white p-6 rounded-lg shadow-sm lg:col-span-3">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                Top 5 Student Attendance
            </h2>
            <div class="h-64">
                <canvas id="attendanceChart"></canvas>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    fetch('api/attendance_stats.php')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('attendanceChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        label: 'Attendance Count',
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
</script>