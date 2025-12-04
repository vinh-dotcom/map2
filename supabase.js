// supabase.js
const SUPABASE_URL = 'https://sierravpvmfhwdefefde.supabase.co'; // Thay bằng Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZXJyYXZwdm1maHdkZWZlZmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjU0MjcsImV4cCI6MjA4MDQwMTQyN30.JqNOpWkGdu0g5CAU-uBSQluhATN3C3LbxiMcxiVbfJo'; // Thay bằng Anon Key

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);