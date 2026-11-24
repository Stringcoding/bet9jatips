'use client'
import { submitGateForm } from '@/features/auth/actions'
import { useState } from 'react'

export default function GatePage() {
  const [error, setError] = useState('')
  
  async function handleSubmit(formData: FormData) {
    const result = await submitGateForm(formData)
    if (result?.error) setError(result.error)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4">
      <div className="bg-bg-slate p-8 rounded-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-surface-white mb-2">Unlock Tips</h1>
        <p className="text-text-muted mb-6 text-sm">Enter your details to access verified coupon codes.</p>
        
        <form action={handleSubmit} className="flex flex-col gap-4">
          <input name="mobile" placeholder="Mobile Number" required
            className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white" />
          <input name="idNumber" placeholder="ID Number" required
            className="bg-bg-deep border border-gray-700 rounded-lg p-3 text-white" />
          {error && <p className="text-brand-red text-sm">{error}</p>}
          <button type="submit" 
            className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-lg transition">
            Pass to See Tips
          </button>
        </form>
      </div>
    </div>
  )
}
