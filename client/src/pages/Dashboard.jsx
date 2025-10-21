import React from 'react'
import { AuthContext } from '../App'

export default function Dashboard() {
  const { user } = React.useContext(AuthContext)
  if (!user) return <div>Welcome. Please login or browse jobs.</div>
  return (
    <div>
      <h2>Dashboard</h2>
      {user.role === 'student' && <div>View and apply to jobs.</div>}
      {user.role === 'company' && <div>Post jobs and manage applications.</div>}
      {(user.role === 'tpo' || user.role === 'admin') && <div>Admin analytics and approvals.</div>}
    </div>
  )
}
