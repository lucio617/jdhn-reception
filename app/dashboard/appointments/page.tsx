"use client";
import { useState, useEffect } from "react";
import React from "react";
import EditAppointmentForm from "../../../components/EditAppointmentForm";
import AppointmentForm from "../../../components/AppointmentForm";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [editing, setEditing] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function fetchAppointments() {
    const res = await fetch(`/api/appointments?page=${page}&limit=${limit}`);
    const data = await res.json();
    setAppointments(data.appointments);
    setTotal(data.total);
  }

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const groupedAppointments: Record<string, typeof appointments> = {};

  appointments.forEach((appt) => {
    const dateKey = new Date(appt.date).toLocaleDateString("en-GB"); // e.g., "2/6/2025"
    if (!groupedAppointments[dateKey]) {
      groupedAppointments[dateKey] = [];
    }
    groupedAppointments[dateKey].push(appt);
  });

  function onSave() {
    setEditing(null);
    setShowCreateModal(false);
    fetchAppointments();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Appointments</h1>

      {/* 🔵 Create Appointment Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Appointment
      </button>

      {/* 🔵 Table of Appointments */}
      <table className="w-full border-collapse border ">
        <thead>
          <tr>
            <th className="border  p-2">Patient Name</th>
            <th className="border  p-2">Date</th>
            <th className="border  p-2">Gender</th>
            <th className="border  p-2">Phone Number</th>
            <th className="border  p-2">Address</th>
            <th className="border  p-2">Amount</th>
            <th className="border  p-2">Entered By</th>
            <th className="border  p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedAppointments).map(
            ([date, dayAppointments]) => {
              const dailyTotal = dayAppointments.reduce(
                (sum, a) => sum + a.amount,
                0
              );
              return (
                <React.Fragment key={date}>
                  {dayAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td className="border border-gray-300 p-2">
                        {appt.patientName}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Date(appt.date).toLocaleString("en-GB", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="border border-gray-300 p-2">{appt.sex}</td>
                      <td className="border border-gray-300 p-2">
                        {appt.phoneNumber}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {appt.address}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {appt.amount}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {appt.enteredBy.userId}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => setEditing(appt)}
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* 💰 Total Row for that Day */}
                  <tr className="bg-green-100 font-semibold">
                    <td
                      colSpan={5}
                      className="border border-gray-300 p-2 text-right"
                    >
                      Total for {date}:
                    </td>
                    <td className="border border-gray-300 p-2">
                      ₹{dailyTotal}
                    </td>
                    <td colSpan={2} className="border border-gray-300 p-2"></td>
                  </tr>
                </React.Fragment>
              );
            }
          )}
        </tbody>
      </table>
      {/* 🔵 Pagination Controls */}
      <div className="mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          disabled={page === Math.ceil(total / limit)}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {/* 🔵 Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Appointment</h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-600 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>
            <EditAppointmentForm
              appointment={editing}
              onSave={onSave}
              close={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {/* 🔵 Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Appointment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-600 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>
            <AppointmentForm onSave={onSave} />
          </div>
        </div>
      )}
    </div>
  );
}
