import { createClient } from '@supabase/supabase-js'
// Kunci "publishable" memang dibuat untuk dipasang di website. Data tetap aman karena dilindungi aturan di database.
export const supabase = createClient(
  'https://raeadiyvvgckclhumqxt.supabase.co',
  'sb_publishable_8CTgOaxPMjhhWnG4QUHOQg_jJhcbdUr'
)
