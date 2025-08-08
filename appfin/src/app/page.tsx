'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/auth/signin')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AppFin
        </h1>
        <p className="text-gray-600">
          Monkey is working, wait a bit...
        </p>
      </div>
    </div>
  )
}
