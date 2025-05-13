// src/components/PrivateRoute.tsx
import React, { useContext, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

interface PrivateRouteProps {
  children: ReactElement
}

function PrivateRoute({ children }: PrivateRouteProps): ReactElement {
  const { token } = useContext(AuthContext)
  return token ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
