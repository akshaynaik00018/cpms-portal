import React from 'react'
import { AuthContext } from '../App'
import { createApi } from '../api'

export default function PostJob() {
  const { token, user } = React.useContext(AuthContext)
  const [form, setForm] = React.useState({ title:'', description:'', jobType:'full-time', location:'', salary:'', minCgpa:7, eligibleBranches:'CSE,ECE', applicationDeadline:'' })
  const [message, setMessage] = React.useState('')

  if (!user || !['company','tpo','admin'].includes(user.role)) return <div>Only companies/TPO can post jobs.</div>

  function set(k, v){ setForm(prev=>({ ...prev, [k]: v })) }

  async function submit(e){
    e.preventDefault()
    try {
      const api = createApi(token)
      const payload = {
        ...form,
        salary: form.salary ? Number(form.salary) : undefined,
        minCgpa: Number(form.minCgpa),
        eligibleBranches: form.eligibleBranches.split(',').map(s=>s.trim()),
        applicationDeadline: new Date(form.applicationDeadline)
      }
      await api.post('/jobs', payload)
      setMessage('Job posted')
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed')
    }
  }

  return (
    <div style={{maxWidth:600}}>
      <h2>Post Job</h2>
      <form onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={e=>set('title', e.target.value)} />
        <textarea placeholder="Description" value={form.description} onChange={e=>set('description', e.target.value)} />
        <select value={form.jobType} onChange={e=>set('jobType', e.target.value)}>
          <option value="full-time">Full-time</option>
          <option value="internship">Internship</option>
        </select>
        <input placeholder="Location" value={form.location} onChange={e=>set('location', e.target.value)} />
        <input placeholder="Salary" value={form.salary} onChange={e=>set('salary', e.target.value)} />
        <input placeholder="Min CGPA" value={form.minCgpa} onChange={e=>set('minCgpa', e.target.value)} />
        <input type="datetime-local" value={form.applicationDeadline} onChange={e=>set('applicationDeadline', e.target.value)} />
        <input placeholder="Eligible Branches (comma separated)" value={form.eligibleBranches} onChange={e=>set('eligibleBranches', e.target.value)} />
        <button type="submit">Create</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  )
}
