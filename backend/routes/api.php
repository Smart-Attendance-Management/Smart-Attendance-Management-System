<?php
/**
 * Route Structure: 
 * 'METHOD /path' => 'Controller@method'
 */

return [
    // ROOT / API STATUS
    'GET /' => 'AuthController@apiStatus',
    
    // AUTH
    'POST /login' => 'AuthController@login',
    'POST /logout' => 'AuthController@logout',
    'GET /me' => 'AuthController@getMe',

    // SUPER ADMIN
    'POST /lecturers' => 'AdminController@createLecturer',
    'POST /students' => 'AdminController@createStudent',
    'POST /courses' => 'AdminController@createCourse',
    'POST /assign-lecturer' => 'AdminController@assignLecturer',
    'POST /assign-student-course' => 'AdminController@assignStudentCourse',
    'GET /users' => 'AdminController@getAllUsers',
    'PUT /users/update' => 'AdminController@updateUser',
    'DELETE /users/delete' => 'AdminController@deleteUser',

    // LECTURER
    'GET /lecturer/courses' => 'LecturerController@getMyCourses',
    'GET /lecturer/students' => 'LecturerController@getStudentsByAssignment',
    'POST /attendance/session/create' => 'LecturerController@createSession',
    'POST /attendance/session/close' => 'LecturerController@closeSession',
    'GET /attendance/report' => 'LecturerController@getAttendanceReport',

    // STUDENT
    'GET /student/courses' => 'StudentController@getMyCourses',
    'POST /attendance/mark' => 'StudentController@markAttendance',
    'GET /student/attendance' => 'StudentController@getAttendanceHistory',
];
?>
