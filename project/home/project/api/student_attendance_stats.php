<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    // Enhanced query with proper JOIN relationships and period filter
    $period = $_GET['period'] ?? 'all'; // week, month, or all
    $whereClause = '';
    
    switch ($period) {
        case 'week':
            $whereClause = 'AND a.marked_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 WEEK)';
            break;
        case 'month':
            $whereClause = 'AND a.marked_at >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)';
            break;
    }

    $stmt = $pdo->prepare("
        SELECT 
            s.name,
            COUNT(*) as attendance,
            ROUND((COUNT(*) * 100.0 / (
                SELECT COUNT(DISTINCT c2.id) 
                FROM classes c2 
                WHERE c2.subject_id = s.id 
                AND c2.date <= CURRENT_TIMESTAMP
            )), 2) as attendance_percentage
        FROM attendance a
        JOIN classes c ON a.class_id = c.id
        JOIN subjects s ON c.subject_id = s.id
        WHERE a.student_id = ?
        {$whereClause}
        GROUP BY s.id, s.name
        ORDER BY attendance DESC
    ");
    $stmt->execute([$_SESSION['user']['id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}