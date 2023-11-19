import { useNavigate } from 'react-router-dom';

export function useNavigateBack(): () => void {
  const navigate = useNavigate();
  return () => navigate(-1);
}
