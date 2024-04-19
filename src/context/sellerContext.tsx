import { ReactNode, createContext, useContext, useState } from 'react'

interface SellerProviderProps {
  children: ReactNode
}

type Seller = {
  A3_COD: string
}

interface SellerContextType {
  seller: Seller | undefined
  handlerSeller: (code: string) => void
}
const SellerContext = createContext<SellerContextType | undefined>(undefined)

const SellerContextProvider = ({ children }: SellerProviderProps) => {
  const [seller, setSeller] = useState<Seller>()

  const handlerSeller = (code: string) => {
    if (!code) return
    setSeller({
      A3_COD: code.trim(),
    })
  }
  return (
    <SellerContext.Provider value={{ handlerSeller, seller }}>
      {children}
    </SellerContext.Provider>
  )
}

function useSellerContext() {
  const context = useContext(SellerContext)
  if (context === undefined) {
    throw new Error(
      'useSellerContext must be used within a SellerContextProvider',
    )
  }
  return context
}

export { SellerContextProvider, useSellerContext }
