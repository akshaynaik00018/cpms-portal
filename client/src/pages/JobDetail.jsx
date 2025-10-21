import React from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../App'
import { createApi } from '../api'

export default function JobDetail() {
  const { id } = useParams()
  const { token, user } = React.useContext(AuthContext)
  const [job, setJob] = React.useState(null)
  const [coverLetter, setCoverLetter] = React.useState('')
  const [resumeUrl, setResumeUrl] = React.useState('')
  const [message, setMessage] = React.useState('')

  React.useEffect(() => {
    const api = createApi(token)
    api.get(`/jobs/${id}`).then(({data})=>setJob(data))
  }, [id, token])

  async function apply() {
    if (!user) { setMessage('Login as student to apply'); return }
    try {
      const api = createApi(token)
      await api.post(`/applications/${id}`, { coverLetter, resumeUrl })
      setMessage('Applied successfully')
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed to apply')
    }
  }

  if (!job) return <div>Loading...</div>
  return (
    <div>
      <h2>{job.title} {job.company?.companyName && `@ ${job.company.companyName}`}</h2>
      <div>{job.description}</div>
      <div>Location: {job.location || 'N/A'}</div>
      <div>Type: {job.jobType}</div>
      <div>Min CGPA: {job.minCgpa}</div>
      <div>Deadline: {new Date(job.applicationDeadline).toLocaleString()}</div>

      {user?.role === 'student' && (
        <div style={{marginTop:16}}>
          <h3>Apply</h3>
          <div>
            <label>Resume URL (or set in Profile)</label>
            <input value={resumeUrl} onChange={e=>setResumeUrl(e.target.value)} placeholder={user.resumeUrl || ''} />
          </div>
          <div>
            <label>Cover letter</label>
            <textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} />
          </div>
          <button onClick={apply}>Apply</button>
          {message && <div>{message}</div>}
        </div>
      )}
    </div>
  )
}
