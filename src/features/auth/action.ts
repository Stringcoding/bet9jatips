'use server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function submitGateForm(formData: FormData) {
  const supabase = await createClient()
  const mobile = formData.get('mobile') as string
  const idNumber = formData.get('idNumber') as string
  
  const sessionToken = crypto.randomUUID()
  
  const { error } = await supabase.from('gate_access').insert({
    mobile_number: mobile,
    id_number: idNumber,
    session_token: sessionToken,
  })
  
  if (error) return { error: error.message }
  
  // Set cookie for gate access
  const cookieStore = await cookies()
  cookieStore.set('gate_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
  
  redirect('/')
}
