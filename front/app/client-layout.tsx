'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/backend-auth'
import { OrderProvider } from '@/lib/order-context'
import { ContactProvider } from '@/lib/contact-context'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <ContactProvider>
            {children}
          </ContactProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  )
}
