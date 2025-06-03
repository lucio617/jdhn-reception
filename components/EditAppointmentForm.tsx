// components/EditAppointmentForm.tsx
import { useState } from 'react'


type AppointmentFormType = {
  patientName: string
  age: number | string
  sex: string
  address: string
  phoneNumber: string
  isNew: boolean
  date: string
  amount: number | string
}

export default function EditAppointmentForm({
  appointment,
  onSave,
  close,
}: {
  appointment: any
  onSave: () => void
  close: () => void
}) {
  const [form, setForm] = useState<AppointmentFormType>({
  patientName: appointment.patientName || '',
  age: appointment.age || '',
  sex: appointment.sex || '',
  address: appointment.address || '',
  phoneNumber: appointment.phoneNumber || '',
  isNew: appointment.isNew || false,
  date: appointment.date || '',
  amount: appointment.amount || '',
})


  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'

    setForm((f) => ({
      ...f,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`/api/appointments?id=${appointment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        amount: Number(form.amount),
      }),
    })

    if (res.ok) {
      alert('Appointment updated')
      onSave()
      close()
    } else {
      alert('Error updating appointment')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="patientName" value={form.patientName} onChange={handleChange} required />
      <input name="age" type="number" value={form.age} onChange={handleChange} required />
      <select name="sex" value={form.sex} onChange={handleChange} required>
        <option value="">Select Sex</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input name="address" value={form.address} onChange={handleChange} required />
      <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
      <label>
        <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> New Patient
      </label>
      <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
      <input name="amount" type="number" value={form.amount} onChange={handleChange} required />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
    </form>
  )
}
