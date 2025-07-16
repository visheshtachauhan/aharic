CREATE TABLE loyalty_settings (
    id INT PRIMARY KEY DEFAULT 1, -- Only one row is expected
    points_per_dollar NUMERIC(10, 2) NOT NULL DEFAULT 10,
    reward_threshold INT NOT NULL DEFAULT 1000, -- e.g., points needed for a reward
    reward_value NUMERIC(10, 2) NOT NULL DEFAULT 5.00, -- e.g., $5 off
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Seed the initial settings row
INSERT INTO loyalty_settings (id) VALUES (1);

-- Enable RLS
ALTER TABLE loyalty_settings ENABLE ROW LEVEL SECURITY;

-- Allow admin full access
CREATE POLICY "Allow full access to service_role"
ON loyalty_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read"
ON loyalty_settings
FOR SELECT
TO authenticated
USING (true); 