<?php
class Response {
    public static function send($status, $message, $data = null, $pagination = null, $errors = null) {
        header("Content-Type: application/json; charset=UTF-8");
        http_response_code($status);
        
        $response = [
            "status" => $status < 400 ? "success" : "error",
            "message" => $message
        ];

        if ($errors !== null) {
            $response["errors"] = $errors;
        }

        if ($data !== null) {
            $response["data"] = $data;
        }

        if ($pagination !== null) {
            $response["pagination"] = $pagination;
        }

        echo json_encode($response);
        exit();
    }
}
?>
