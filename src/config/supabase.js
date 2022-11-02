const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.URL;
const supabaseKey = process.env.KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
