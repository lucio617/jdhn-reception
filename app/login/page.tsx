'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [userId, setuserID] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    console.log('Submitting login form')
    e.preventDefault()
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push(data.redirectPath || '/dashboard') // fallback if needed
    } else {
      alert("Invalid credentials")
      setError(data.error || 'Something went wrong')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
        <input type="text" placeholder="UserId" value={userId} onChange={(e) => setuserID(e.target.value)} required className="border p-2 rounded"/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </main>
  )
}
