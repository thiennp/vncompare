<?php
// VNCompare API - Force PHP Detection
// This file forces Vercel to detect PHP instead of Node.js

// Redirect to the actual API in apps/api
header('Location: apps/api/public/index.php');
exit;
