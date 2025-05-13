// src/components/RegisterForm.tsx
import React, { useState, useContext } from 'react'
import { AuthContext } from '../AuthContext'

const RegisterForm: React.FC = () => {
  const { register } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(email, password)
      setMessage('Registration successful! You can now log in.')
    } catch (err: any) {
      setMessage(
        err.response?.data || 'Registration failed; please try again.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  )
}

export default RegisterForm
