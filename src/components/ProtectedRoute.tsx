// ProtectedRoute.tsx
import {Navigate, useLocation} from 'react-router-dom';
import {useUserContext} from '../hooks/contextHooks';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {user} = useUserContext();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
