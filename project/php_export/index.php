<?php
session_start();
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>College Attendance System</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <div id="app">
        <?php if (!isset($_SESSION['user'])): ?>
            <?php include 'login.php'; ?>
        <?php else: ?>
            <?php include 'header.php'; ?>
            <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <?php if ($_SESSION['user']['role'] === 'teacher'): ?>
                    <?php include 'teacher_dashboard.php'; ?>
                <?php else: ?>
                    <?php include 'student_dashboard.php'; ?>
                <?php endif; ?>
            </main>
        <?php endif; ?>
    </div>
    <script src="js/app.js"></script>
</body>
</html>