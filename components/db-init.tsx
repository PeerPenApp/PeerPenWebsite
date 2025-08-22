"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function DatabaseInit() {
  const [mounted, setMounted] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/init-db')
      if (response.ok) {
        const data = await response.json()
        setIsInitialized(data.initialized)
        setError(null)
      } else {
        throw new Error('Failed to check database status')
      }
    } catch (error) {
      console.error('Error checking database status:', error)
      setError('Failed to check database status')
    }
  }

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/init-db', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setIsInitialized(data.initialized)
        toast.success('Database initialized successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to initialize database')
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      setError(error instanceof Error ? error.message : 'Failed to initialize database')
      toast.error('Failed to initialize database')
    } finally {
      setIsInitializing(false)
    }
  }

  const resetDatabase = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL DATA and recreate the database schema. This action cannot be undone. Are you sure you want to continue?')) {
      return
    }

    setIsResetting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/init-db/reset', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setIsInitialized(data.initialized)
        toast.success('Database reset successfully! All data has been cleared and schema recreated.')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reset database')
      }
    } catch (error) {
      console.error('Error resetting database:', error)
      setError(error instanceof Error ? error.message : 'Failed to reset database')
      toast.error('Failed to reset database')
    } finally {
      setIsResetting(false)
    }
  }

  // Check status on component mount
  useEffect(() => {
    if (mounted) {
      checkDatabaseStatus()
    }
  }, [mounted])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {isInitialized ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">Database is initialized</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-700">Database needs initialization</span>
            </>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={checkDatabaseStatus}
            variant="outline"
            size="sm"
          >
            Check Status
          </Button>
          
          {!isInitialized && (
            <Button
              onClick={initializeDatabase}
              disabled={isInitializing}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isInitializing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Initialize
            </Button>
          )}
        </div>

        {isInitialized && (
          <div className="pt-2 border-t border-border">
            <Button
              onClick={resetDatabase}
              disabled={isResetting}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              {isResetting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              Reset Database (Testing Only)
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              ⚠️ This will delete ALL data and recreate the schema
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {isInitialized 
            ? "Your database is ready to store essays and analyses."
            : "Click initialize to set up the database tables for storing essays and analyses."
          }
        </div>
      </CardContent>
    </Card>
  )
}
