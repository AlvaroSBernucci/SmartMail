import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

function PrivateRoute({ children }: React.PropsWithChildren) {
  const token = getToken();

  if (!token) return <Navigate to="/login" replace />;
  else return children;
}

export default PrivateRoute;
