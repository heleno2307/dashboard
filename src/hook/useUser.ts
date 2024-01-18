import { useUserContext } from '@/context/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type User = {
  code: string;
  data: Data;
};

type Data = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

const useUser = () => {
  const { user } = useUserContext();
  const router = useRouter()
  useEffect(() => {
      let userSessionString: string | null = sessionStorage.getItem('user');
      if (user == null && userSessionString == null) {
        router.push('/')
      }
  }, [user,router]);
};

export default useUser;
