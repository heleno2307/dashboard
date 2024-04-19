import { createContext, useContext, useState, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type AllContextType = {
  all: boolean
  alterAll: () => void
}

const allContext = createContext<AllContextType | undefined>(undefined)

const AllProvider = ({ children }: Props) => {
  const [all, setAll] = useState(false)

  const alterAll = () => {
    setAll((prevAll) => !prevAll)
  }

  const contextValue: AllContextType = {
    all,
    alterAll,
  }

  return (
    <allContext.Provider value={contextValue}>{children}</allContext.Provider>
  )
}

const useAllContext = (): AllContextType => {
  const context = useContext(allContext)
  if (!context) {
    throw new Error('useAllContext must be used within an AllProvider')
  }
  return context
}

export { AllProvider, useAllContext }
