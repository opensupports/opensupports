<?php
// Kubernetes 환경변수를 사용한 데이터베이스 설정
define('MYSQL_HOST', getenv('DB_HOST') ?: 'mysql-service');
define('MYSQL_PORT', getenv('DB_PORT') ?: '3306');
define('MYSQL_USER', getenv('DB_USER') ?: 'opensupports');
define('MYSQL_PASSWORD', getenv('DB_PASSWORD') ?: 'opensupports123');
define('MYSQL_DATABASE', getenv('DB_NAME') ?: 'opensupports');
