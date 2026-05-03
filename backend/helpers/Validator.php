<?php
class Validator {
    private $errors = [];

    public function validate($data, $rules) {
        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            $ruleList = explode('|', $fieldRules);

            foreach ($ruleList as $rule) {
                $this->applyRule($field, $value, $rule);
            }
        }
        return empty($this->errors);
    }

    private function applyRule($field, $value, $rule) {
        if ($rule === 'required' && (is_null($value) || $value === '')) {
            $this->errors[$field] = ucfirst($field) . " is required.";
        } elseif ($rule === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = "Invalid email format.";
        } elseif ($rule === 'integer' && !is_numeric($value)) {
            $this->errors[$field] = ucfirst($field) . " must be an integer.";
        } elseif ($rule === 'code' && (!is_string($value) || strlen($value) !== 6)) {
            $this->errors[$field] = ucfirst($field) . " must be a 6-digit code.";
        }
    }

    public function getErrors() {
        return $this->errors;
    }
}
?>
