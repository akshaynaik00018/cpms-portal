import React from 'react'
import { AuthContext } from '../App'
import { createApi } from '../api'

export default function Analytics() {
  const { token, user } = React.useContext(AuthContext)
  const [summary, setSummary] = React.useState(null)

  React.useEffect(() => {
    if (!['tpo','admin'].includes(user?.role)) return
    const api = createApi(token)
    api.get('/analytics/summary').then(({data})=>setSummary(data))
  }, [token, user])

  if (!user || !['tpo','admin'].includes(user.role)) return <div>Only TPO/Admin.</div>
  if (!summary) return <div>Loading...</div>

  return (
    <div>
      <h2>Analytics</h2>
      <div>Students Applied: {summary.studentsApplied}</div>
      <div>Total Applications: {summary.totalApplications}</div>
      <div>Open Jobs: {summary.openJobs}</div>
      <div>Offers Made: {summary.offersMade}</div>
    </div>
  )
}
