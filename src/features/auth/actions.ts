'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function submitGateForm(username: string, email: string, idNumber: string) {
  const supabase = await createClient()
  const sessionToken = crypto.randomUUID()
  
  // 1. Create a pending record in the database (Step 1)
  const { error } = await supabase.from('gate_access').insert({
    username: username,
    email: email,
    id_number: idNumber,
    verification_status: 'pending',
    session_token: sessionToken,
  })
  
  if (error) {
    console.error("Gate Form Error:", error.message);
    return { error: error.message }
  }
  
  return { success: true }
}

export async function submitVerificationForm(idType: string, idNumber: string) {
  const supabase = await createClient()
  const sessionToken = crypto.randomUUID()
  
  // 2. Update the most recent pending record (Step 2)
  // We find the most recent 'pending' record and update it with the Step 2 details
  const { data: pendingRecord, error: fetchError } = await supabase
    .from('gate_access')
    .select('id')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !pendingRecord) {
    return { error: "Session expired. Please start the form again." }
  }

  const { error } = await supabase.from('gate_access').update({
    id_type: idType,
    verification_number: idNumber, // Saving the Step 2 ID number
    verification_status: 'verifying', // Changes status to verifying (for the 1-min timer)
    session_token: sessionToken,
  }).eq('id', pendingRecord.id)

  if (error) {
    console.error("Verification Form Error:", error.message);
    return { error: error.message }
  }

  // 3. Set the cookie. This is what unlocks the /tips route.
  const cookieStore = await cookies()
  cookieStore.set('gate_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return { success: true }
}
