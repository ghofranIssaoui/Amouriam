// lib/contact-context.tsx
'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ContactFormData {
  name: string
  email: string
  message: string
  subject?: string
}

interface ContactContextType {
  isSubmitting: boolean
  submitContact: (data: ContactFormData) => Promise<{ success: boolean; message: string }>
  resetForm: () => void
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitContact = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit contact form')
      }

      return { success: true, message: 'Message sent successfully!' }
    } catch (error) {
      console.error('Contact form error:', error)
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send message' 
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    // Reset form state if needed
  }

  return (
    <ContactContext.Provider value={{ isSubmitting, submitContact, resetForm }}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContact() {
  const context = useContext(ContactContext)
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider')
  }
  return context
}