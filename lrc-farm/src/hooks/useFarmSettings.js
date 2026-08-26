import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useFarmSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('farm_settings')
        .select('*')
        .limit(1)
        .single()

      if (!error) {
        setSettings(data)
      }

      setLoading(false)
    }

    fetchSettings()
  }, [])

  return {
    settings,
    loading,
  }
}