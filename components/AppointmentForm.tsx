import { useState } from 'react'

export default function AppointmentForm({ onSave }: { onSave: () => void }) {
  const [form, setForm] = useState({
    patientName: '',
    age: '',
    sex: '',
    address: '',
    phoneNumber: '',
    isNew: true,
    date: '',
    amount: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        amount: Number(form.amount),
      }),
    })
    if (res.ok) {
      alert('Appointment created')
      onSave()
    } else {
      alert('Error creating appointment')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient Name" required />
      <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" required />
      <select name="sex" value={form.sex} onChange={handleChange} required>
        <option value="">Select Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
      <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
      <label>
        <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> New Patient
      </label>
      <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
      <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  )
}
