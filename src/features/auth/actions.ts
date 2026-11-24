'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function submitGateForm(mobile: string, idNumber: string) {
  const supabase = await createClient()
  
  // Create a pending record in the database
  const { error } = await supabase.from('gate_access').insert({
    mobile_number: mobile,
    id_number: idNumber,
    verification_status: 'pending',
    session_token: crypto.randomUUID(), // Temporary token
  })
  
  if (error) return { error: error.message }
  return { success: true }
}

export async function submitVerificationForm(idType: string, idNumber: string) {
  const supabase = await createClient()
  const sessionToken = crypto.randomUUID()
  
  // Update the most recent pending record, verify it, and set the gate_token
  const { error } = await supabase.from('gate_access').update({
    id_type: idType,
    verification_status: 'verifying', // Status changes to verifying for the 1-minute timer
    session_token: sessionToken,
  }).eq('id_number', idNumber).eq('verification_status', 'pending')

  if (error) return { error: error.message }

  // Set the cookie. This is what unlocks the /tips route.
  const cookieStore = await cookies()
  cookieStore.set('gate_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  return { success: true }
}
