import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useUserContext } from '@/context/userContext'
import getName from '@/routes/getName'
import capitalizeNames from '@/utilities/capitalizeNames'

const Name = () => {
  const [name, setName] = useState<string>()
  const { user } = useUserContext()

  const { data, isError, isLoading } = useQuery({
    queryKey: ['user-name'],
    queryFn: () => getName(user?.code),
    staleTime: Infinity,
    enabled: !!user,
  })

  useEffect(() => {
    if (data && data[0].USR_CODIGO) {
      setName(capitalizeNames(data[0].USR_CODIGO.toString()))
    }
  }, [data])

  useEffect(() => {
    if (isError && data !== undefined) {
      toast.error('Ops! Algo deu errado ao carregar o nome do usuário.', {
        duration: 1.5 * 1000,
      })
    }
  }, [isError, data])

  return <>{isLoading ? null : <h1>Olá {name}</h1>}</>
}
export default Name
