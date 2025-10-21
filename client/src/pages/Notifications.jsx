import React from 'react'
import { AuthContext } from '../App'
import { createApi } from '../api'

export default function Notifications() {
  const { token, user } = React.useContext(AuthContext)
  const [items, setItems] = React.useState([])

  React.useEffect(() => {
    if (!user) return
    const api = createApi(token)
    api.get('/notifications/me').then(({data})=>setItems(data))
  }, [token, user])

  if (!user) return <div>Login first</div>

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {items.map(n => (
          <li key={n._id} style={{margin:'8px 0'}}>
            <b>{n.title}</b> - {n.body}
            <span style={{marginLeft:8, color:n.read ? 'gray' : 'green'}}>{n.read ? 'read' : 'new'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
