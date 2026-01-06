-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_at INTEGER NOT NULL
);

-- Insert default settings
INSERT OR IGNORE INTO site_settings (setting_key, setting_value, description, updated_at)
VALUES 
    ('fb_pixel_id', '', 'Facebook Pixel ID for tracking website events', strftime('%s', 'now')),
    ('ga_measurement_id', 'G-WDRD35B2HV', 'Google Analytics Measurement ID', strftime('%s', 'now'));
