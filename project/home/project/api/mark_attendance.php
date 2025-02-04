<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$classId = $data['class_id'] ?? null;

if (!$classId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing class_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO attendance (class_id, student_id)
        VALUES (?, ?)
    ");
    $stmt->execute([$classId, $_SESSION['user']['id']]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}