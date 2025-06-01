import Navbar from '../components/Navbar'

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Welcome to the Doctor Booking App</h1>
      </main>
    </div>
  )
}