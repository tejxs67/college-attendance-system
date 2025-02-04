<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'teacher') {
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
            p.full_name as name,
            COUNT(*) as attendance,
            ROUND((COUNT(*) * 100.0 / (
                SELECT COUNT(DISTINCT c2.id) 
                FROM classes c2 
                WHERE c2.created_by = ? 
                AND c2.date <= CURRENT_TIMESTAMP
            )), 2) as attendance_percentage
        FROM attendance a
        JOIN profiles p ON a.student_id = p.id
        JOIN classes c ON a.class_id = c.id
        WHERE c.created_by = ? 
        {$whereClause}
        GROUP BY p.id, p.full_name
        ORDER BY attendance DESC
        LIMIT 5
    ");
    $stmt->execute([$_SESSION['user']['id'], $_SESSION['user']['id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}