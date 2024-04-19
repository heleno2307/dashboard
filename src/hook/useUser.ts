import { useUserContext } from '@/context/userContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const useUser = () => {
  const { user } = useUserContext()
  const router = useRouter()
  useEffect(() => {
    const userSessionString: string | null = sessionStorage.getItem('user')
    if (user == null && userSessionString == null) {
      router.push('/')
    }
  }, [user, router])
}

export default useUser
