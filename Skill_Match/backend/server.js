const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("WARNING: Supabase credentials missing or invalid. DB operations will fail.");
  // Dummy client to prevent crash on usage, or just handle null check later
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: { message: "Supabase not configured" } }),
      insert: () => ({ data: null, error: { message: "Supabase not configured" } }),
    }),
    auth: {
      signInWithPassword: () => ({ error: { message: "Supabase not configured" } }),
      signUp: () => ({ error: { message: "Supabase not configured" } }),
    }
  };
}

app.get('/', (req, res) => {
  res.send('SkillMatch Backend is running');
});

// Basic Match API (Placeholder)
app.post('/api/match', async (req, res) => {
  // Logic to match seeker skills with job requirements
  const { seekerId } = req.body;
  res.json({ message: "Matching logic to be implemented", seekerId });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
