'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function submitGateForm(username: string, email: string, idNumber: string) {
  const supabase = await createClient()
  const sessionToken = crypto.randomUUID()
  
  // 1. Create a pending record
  const { error } = await supabase.from('gate_access').insert({
    username: username,
    email: email,
    id_number: idNumber,
    verification_status: 'pending',
    session_token: sessionToken,
  })
  
  if (error) return { error: error.message }
  return { success: true }
}

export async function submitVerificationForm(idType: string, idNumber: string, email: string) {
  const supabase = await createClient()
  const sessionToken = crypto.randomUUID()
  
  // 2. Update the specific record using the email from Step 1
  // This guarantees we update the exact user who just filled the form
  const { error } = await supabase.from('gate_access').update({
    id_type: idType,
    verification_number: idNumber, // The ID they typed in step 2
    verification_status: 'verifying',
    session_token: sessionToken,
  })
  .eq('email', email) // Match by email!
  .eq('verification_status', 'pending'); // Ensure it's the one they just started

  if (error) {
    console.error("Update Error:", error.message);
    return { error: error.message }
  }

  const cookieStore = await cookies()
  cookieStore.set('gate_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, 
    path: '/',
  })
  
  return { success: true }
}
