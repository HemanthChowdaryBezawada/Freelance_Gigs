-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id), -- The user who sent the message
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view messages for their own applications (as seeker or if they own the job as employer)
CREATE POLICY "Users can view messages for their applications" ON messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id = messages.application_id
            AND (a.applicant_id = auth.uid() OR j.employer_id = auth.uid())
        )
    );

-- Allow users to insert messages into their applications
CREATE POLICY "Users can insert messages into their applications" ON messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id = messages.application_id
            AND (a.applicant_id = auth.uid() OR j.employer_id = auth.uid())
        )
    );
