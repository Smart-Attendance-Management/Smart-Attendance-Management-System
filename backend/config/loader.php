<?php
class Config {
    private static $config = [];

    public static function load() {
        $path = __DIR__ . '/../.env';
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;

            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            self::$config[$name] = $value;
            putenv("$name=$value");
        }
    }

    public static function get($key, $default = null) {
        return self::$config[$key] ?? getenv($key) ?: $default;
    }
}

Config::load();
?>
