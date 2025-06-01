'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          const data = await res.json()
          setRole(data.role)
        } else {
          setRole(null)
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout')
    router.push('/login')
  }

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
      <div className="font-bold text-xl">Doctor Booking</div>
      <div className="space-x-4 flex items-center">
        <Link href="/dashboard/appointments" className="hover:underline">Appointments</Link>
        {role === 'ADMIN' && (
          <Link href="/dashboard/receptionists" className="hover:underline">Receptionists</Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
