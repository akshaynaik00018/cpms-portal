import React from 'react'
import { AuthContext } from '../App'
import { createApi } from '../api'

export default function Applications() {
  const { token, user } = React.useContext(AuthContext)
  const [apps, setApps] = React.useState([])

  React.useEffect(() => {
    const api = createApi(token)
    if (user?.role === 'student') {
      api.get('/applications/me').then(({data})=>setApps(data))
    }
  }, [token, user])

  if (!user) return <div>Login first</div>

  return (
    <div>
      <h2>My Applications</h2>
      <ul>
        {apps.map(a => (
          <li key={a._id}>
            {a.job?.title} - <b>{a.status}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}
