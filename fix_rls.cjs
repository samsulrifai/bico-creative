const { Client } = require('pg'); 
const client = new Client({ connectionString: 'postgresql://postgres:Streetcore88@db.xftsgolenohyqtrnrnqi.supabase.co:5432/postgres' }); 
client.connect()
  .then(() => client.query(`
    ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE hero_content DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE services DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE projects DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE team_members DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE about_content DISABLE ROW LEVEL SECURITY; 
    ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
  `))
  .then(() => { 
    console.log("RLS Disabled successfully!"); 
    client.end(); 
  })
  .catch(e => { 
    console.error("Error:", e); 
    client.end(); 
  });
