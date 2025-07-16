CREATE TABLE support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- e.g., 'new', 'in_progress', 'resolved'
    resolved_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for service_role to access the table
-- This allows our backend (API routes) to have full access
CREATE POLICY "Allow full access to service_role"
ON support_requests
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create policy for authenticated users to insert their own requests
CREATE POLICY "Allow authenticated users to insert"
ON support_requests
FOR INSERT
TO authenticated
WITH CHECK (true); 