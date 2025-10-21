import React from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'
import { createApi } from '../api'

export default function Jobs() {
  const { token } = React.useContext(AuthContext)
  const [jobs, setJobs] = React.useState([])
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    const api = createApi(token)
    api.get('/jobs', { params: { q } }).then(({data}) => setJobs(data))
  }, [q, token])

  return (
    <div>
      <h2>Jobs</h2>
      <input placeholder="Search jobs" value={q} onChange={e=>setQ(e.target.value)} />
      <ul>
        {jobs.map(j => (
          <li key={j._id} style={{margin:'12px 0'}}>
            <div style={{fontWeight:'bold'}}>
              <Link to={`/jobs/${j._id}`}>{j.title}</Link> {j.company?.companyName && `@ ${j.company.companyName}`}
            </div>
            <div>{(j.description || '').substring(0,140)}...</div>
            <div>Type: {j.jobType} | Min CGPA: {j.minCgpa}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
