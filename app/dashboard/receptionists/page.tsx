'use client'
import { useState, useEffect } from 'react'

export default function ReceptionistsPage() {
  const [receptionists, setReceptionists] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function fetchReceptionists() {
    const res = await fetch('/api/receptionists')
    const data = await res.json()
    setReceptionists(data)
  }

  useEffect(() => {
    fetchReceptionists()
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/receptionists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      alert('Receptionist added')
      setEmail('')
      setPassword('')
      fetchReceptionists()
    } else {
      alert('Error adding receptionist')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this receptionist?')) return
    const res = await fetch('/api/receptionists', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.status === 204) {
      alert('Deleted')
      fetchReceptionists()
    } else {
      alert('Error deleting')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Receptionists</h1>

      <form onSubmit={handleAdd} className="mb-4 space-x-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {receptionists.map((r) => (
            <tr key={r.id}>
              <td className="border border-gray-300 p-2">{r.email}</td>
              <td className="border border-gray-300 p-2">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
