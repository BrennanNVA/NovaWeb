const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gtidsunwacqkrpfwghdv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aWRzdW53YWNxa3JwZndnaGR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzE5NjE4OCwiZXhwIjoyMDgyNzcyMTg4fQ.yO1wzPbe2nFPMjcC-v2ePl49S4vX7HteTxf20pLFsRc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Adding stock_score column...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE articles ADD COLUMN IF NOT EXISTS stock_score INTEGER;'
    });
    
    if (error) {
      console.error('Error adding column:', error);
      // Try direct SQL if RPC fails
      const { error: directError } = await supabase
        .from('articles')
        .select('stock_score')
        .limit(1);
      
      if (directError && directError.message.includes('column "stock_score" does not exist')) {
        console.log('Column does not exist, need to add via Supabase dashboard');
      } else {
        console.log('Column might already exist');
      }
    } else {
      console.log('Column added successfully');
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
}

runMigration();
