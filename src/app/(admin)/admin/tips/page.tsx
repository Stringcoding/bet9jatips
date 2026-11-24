'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function AdminTipsPage() {
  const [tips, setTips] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    supabase.from('tips').select('*').then(({ data }) => setTips(data || []))
  }, [])
  
  return (
    <div className="p-6">
      <h1 className="text-2xl text-white mb-4">Manage Tips</h1>
      <table className="w-full text-white">
        <thead><tr><th>Tipster</th><th>Code</th><th>Odds</th><th>Active</th></tr></thead>
        <tbody>
          {tips.map(tip => (
            <tr key={tip.id}>
              <td>{tip.tipster_name}</td>
              <td>{tip.booking_code}</td>
              <td>{tip.total_odds}</td>
              <td>{tip.is_active ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
