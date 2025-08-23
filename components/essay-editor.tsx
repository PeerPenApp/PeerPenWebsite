"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { StarRating, StarRatingDisplay } from '@/components/ui/star-rating'
import { useUser } from '@clerk/nextjs'
import { 
  Save, 
  FileText, 
  Brain, 
  Download, 
  Trash2, 
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  Heart,
  MessageCircle,
  Globe,
  Lock,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Essay {
  id: string
  title: string
  college?: string
  prompt?: string
  content: string
  wordCount: number
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'followers' | 'private'
  ratingCount?: number
  commentCount?: number
  createdAt: string
  updatedAt: string
}

interface Analysis {
  analysis: string
  model_used: string
  success: boolean
  note?: string
}

interface Feedback {
  id: string
  essay_id: string
  author_id: string | null
  provider: string
  model_name: string
  general_comment: string
  created_at: string
}

interface EvaluationScores {
  feedback_id: string
  flow: number
  hook: number
  voice: number
  uniqueness: number
  conciseness: number
  authenticity: number
  overall: number
}

interface LikeStatus {
  ratingCount: number
  userRating: number | null
  avgRating: number
}

interface Comment {
  id: string
  content: string
  parentId?: string
  author: string
  createdAt: string
  updatedAt: string
}

export default function EssayEditor() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [essays, setEssays] = useState<Essay[]>([])
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(null)
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScores | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({ ratingCount: 0, userRating: null, avgRating: 0 })
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [college, setCollege] = useState('')
  const [prompt, setPrompt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public')

  // Debug authentication state
  useEffect(() => {
    console.log('EssayEditor Auth State:', { isLoaded, isSignedIn, userId: user?.id })
  }, [isLoaded, isSignedIn, user])

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to manage your essays</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to create, edit, and analyze essays.
          </p>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Fetch essays on component mount
  useEffect(() => {
    fetchEssays()
  }, [])

  // Fetch existing feedback and analysis when essay changes
  useEffect(() => {
    if (currentEssay) {
      fetchExistingAnalysis(currentEssay.id)
      fetchLikeStatus(currentEssay.id)
      fetchComments(currentEssay.id)
    }
  }, [currentEssay])

  const fetchEssays = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/essays')
      if (response.ok) {
        const data = await response.json()
        setEssays(data.essays || [])
      }
    } catch (error) {
      console.error('Error fetching essays:', error)
      toast.error('Failed to fetch essays')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExistingAnalysis = async (essayId: string) => {
    try {
      // Fetch existing feedback
      const feedbackResponse = await fetch(`/api/essays/${essayId}/feedback`)
      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json()
        if (feedbackData.feedback && feedbackData.feedback.length > 0) {
          const latestFeedback = feedbackData.feedback[0] // Get the most recent
          setExistingFeedback(latestFeedback)
          
          // Fetch evaluation scores for this feedback
          const scoresResponse = await fetch(`/api/essays/${essayId}/feedback/${latestFeedback.id}/scores`)
          if (scoresResponse.ok) {
            const scoresData = await scoresResponse.json()
            if (scoresData.scores) {
              setEvaluationScores(scoresData.scores)
            }
          }
          
          // Set analysis data
          setAnalysis({
            analysis: latestFeedback.general_comment,
            model_used: latestFeedback.model_name,
            success: true,
            note: latestFeedback.provider === 'ai' ? 'AI Analysis' : 'Human Feedback'
          })
        } else {
          setExistingFeedback(null)
          setEvaluationScores(null)
          setAnalysis(null)
        }
      }
    } catch (error) {
      console.error('Error fetching existing analysis:', error)
    }
  }

  const fetchLikeStatus = async (essayId: string) => {
    try {
      const response = await fetch(`/api/essays/${essayId}/like`)
      if (response.ok) {
        const data = await response.json()
        setLikeStatus({
          ratingCount: data.ratingCount || 0,
          userRating: data.userRating,
          avgRating: data.avgRating || 0
        })
      }
    } catch (error) {
      console.error('Error fetching like status:', error)
    }
  }

  const fetchComments = async (essayId: string) => {
    try {
      const response = await fetch(`/api/essays/${essayId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const editEssay = (essay: Essay) => {
    setCurrentEssay(essay)
    setTitle(essay.title)
    setCollege(essay.college || '')
    setPrompt(essay.prompt || '')
    setContent(essay.content)
    setStatus(essay.status)
    setVisibility(essay.visibility)
    setIsEditing(true)
  }

  const saveEssay = async () => {
    if (!title.trim() || !content.trim()) return

    try {
      setIsLoading(true)
      const essayData = {
        title: title.trim(),
        college: college.trim() || undefined,
        prompt: prompt.trim() || undefined,
        content: content.trim(),
        status,
        visibility
      }

      if (currentEssay) {
        // Update existing essay
        const response = await fetch(`/api/essays/${currentEssay.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(essayData)
        })

        if (response.ok) {
          const updatedEssay = await response.json()
          setEssays(prev => prev.map(e => e.id === currentEssay.id ? updatedEssay.essay : e))
          setCurrentEssay(updatedEssay.essay)
          toast.success('Essay updated successfully!')
        } else {
          toast.error('Failed to update essay')
        }
      } else {
        // Create new essay
        const response = await fetch('/api/essays', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(essayData)
        })

        if (response.ok) {
          const newEssay = await response.json()
          setEssays(prev => [newEssay.essay, ...prev])
          setCurrentEssay(newEssay.essay)
          toast.success('Essay created successfully!')
        } else {
          toast.error('Failed to create essay')
        }
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error saving essay:', error)
      toast.error('Failed to save essay')
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeEssay = async (essayId: string) => {
    try {
      setIsAnalyzing(true)
      const response = await fetch(`/api/essays/${essayId}/analyze`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Essay analysis completed!')
          // Refresh the analysis data
          await fetchExistingAnalysis(essayId)
        } else {
          toast.error(data.error || 'Analysis failed')
        }
      } else {
        toast.error('Failed to analyze essay')
      }
    } catch (error) {
      console.error('Error analyzing essay:', error)
      toast.error('Failed to analyze essay')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const downloadEssay = (essay: Essay) => {
    const content = `Title: ${essay.title}\n\n${essay.content}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${essay.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteEssay = async (essayId: string) => {
    if (!confirm('Are you sure you want to delete this essay? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/essays/${essayId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setEssays(prev => prev.filter(e => e.id !== essayId))
        if (currentEssay?.id === essayId) {
          setCurrentEssay(null)
          setIsEditing(false)
        }
        toast.success('Essay deleted successfully!')
      } else {
        toast.error('Failed to delete essay')
      }
    } catch (error) {
      console.error('Error deleting essay:', error)
      toast.error('Failed to delete essay')
    }
  }

  const handleRatingChange = async (essayId: string, newRating: number) => {
    try {
      const response = await fetch(`/api/essays/${essayId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: newRating })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state
        setLikeStatus(prev => ({ 
          ratingCount: data.rated ? prev.ratingCount : prev.ratingCount - 1, 
          userRating: data.rated ? newRating : null, 
          avgRating: prev.avgRating 
        }))
        
        // Refresh the rating data to get updated averages
        await fetchLikeStatus(essayId)
        
        toast.success(data.message)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update rating')
      }
    } catch (error) {
      console.error('Error updating rating:', error)
      toast.error('Failed to update rating')
    }
  }

  const toggleEssayStatus = async (essayId: string, currentStatus: string) => {
    try {
      // Cycle through statuses: draft → published → archived → draft
      let newStatus: 'draft' | 'published' | 'archived'
      switch (currentStatus) {
        case 'draft':
          newStatus = 'published'
          break
        case 'published':
          newStatus = 'archived'
          break
        case 'archived':
          newStatus = 'draft'
          break
        default:
          newStatus = 'draft'
      }

      // Use a simple status update endpoint that bypasses the problematic triggers
      const response = await fetch(`/api/essays/${essayId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Update the local state
        setEssays(prev => prev.map(e => 
          e.id === essayId ? { ...e, status: newStatus } : e
        ))
        
        // Update current essay if it's the one being viewed
        if (currentEssay?.id === essayId) {
          setCurrentEssay(prev => prev ? { ...prev, status: newStatus } : null)
        }
        
        toast.success(`Essay ${newStatus}!`)
      } else {
        toast.error('Failed to update essay status')
      }
    } catch (error) {
      console.error('Error toggling essay status:', error)
      toast.error('Failed to update essay status')
    }
  }

  const postComment = async (essayId: string) => {
    if (!newComment.trim()) return

    try {
      setIsPostingComment(true)
      const response = await fetch(`/api/essays/${essayId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setNewComment('')
          await fetchComments(essayId)
          toast.success('Comment posted successfully!')
        }
      } else {
        toast.error('Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to post comment')
    } finally {
      setIsPostingComment(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Essay Editor</h1>
        {!isEditing && (
          <Button
            onClick={() => {
              setCurrentEssay(null)
              setTitle('')
              setCollege('')
              setPrompt('')
              setContent('')
              setStatus('draft')
              setVisibility('public')
              setIsEditing(true)
            }}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Essay
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Essay List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Essays</h2>
          <div className="space-y-3">
            {essays.map((essay) => (
              <Card 
                key={essay.id} 
                className={`cursor-pointer transition-colors ${
                  currentEssay?.id === essay.id ? 'ring-2 ring-accent' : 'hover:bg-muted/50'
                }`}
                onClick={() => editEssay(essay)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{essay.title}</h3>
                      {essay.college && (
                        <p className="text-sm text-muted-foreground">{essay.college}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={essay.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                          {essay.visibility === 'public' ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                          {essay.visibility}
                        </Badge>
                        <Badge variant={essay.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {essay.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {essay.wordCount} words
                      </p>
                      {essay.visibility === 'public' && (essay.ratingCount || essay.commentCount) && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {essay.ratingCount && essay.ratingCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {essay.ratingCount}
                            </span>
                          )}
                          {essay.commentCount && essay.commentCount > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {essay.commentCount}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {new Date(essay.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleEssayStatus(essay.id, essay.status)
                        }}
                        title={`Current: ${essay.status}. Click to cycle: draft → published → archived`}
                        className={essay.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                                  essay.status === 'archived' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 
                                  'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                      >
                        {essay.status === 'published' ? '✅ Published' : 
                         essay.status === 'archived' ? '📁 Archived' : 
                         '📝 Draft'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          analyzeEssay(essay.id)
                        }}
                        disabled={isAnalyzing}
                        title={existingFeedback ? "Redo Analysis" : "Analyze Essay"}
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : existingFeedback ? (
                          <RefreshCw className="w-4 h-4" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadEssay(essay)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteEssay(essay.id)
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {essays.length === 0 && (
              <Card className="p-6 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No essays yet. Create your first one!</p>
              </Card>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {currentEssay ? 'Edit Essay' : 'New Essay'}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveEssay}
                      disabled={isLoading || !title.trim() || !content.trim()}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {currentEssay ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter essay title..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="college">College/University (Optional)</Label>
                    <Input
                      id="college"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g., Harvard, MIT, Stanford..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <select
                      id="visibility"
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Followers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="prompt">Essay Prompt (Optional)</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter the essay prompt or question..."
                    className="mt-1 min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Essay Content</Label>
                  <div className="mt-1 relative">
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your essay here..."
                      className="min-h-[400px] resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                      {wordCount} words
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="visibility-toggle"
                    checked={visibility === 'public'}
                    onCheckedChange={(checked) => setVisibility(checked ? 'public' : 'private')}
                  />
                  <Label htmlFor="visibility-toggle">
                    {visibility === 'public' ? (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span>Public - Anyone can view and interact</span>
                      </div>
                    ) : visibility === 'followers' ? (
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-yellow-600" />
                        <span>Followers Only - Only your followers can view</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <EyeOff className="h-4 w-4 text-red-600" />
                        <span>Private - Only you can view</span>
                      </div>
                    )}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ) : currentEssay ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{currentEssay.title}</CardTitle>
                  <div className="flex gap-2">
                    {currentEssay.visibility === 'public' && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setShowComments(!showComments)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {showComments ? 'Hide' : 'Show'} Comments
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAnalysis(!showAnalysis)}
                        >
                          {showAnalysis ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                          {showAnalysis ? 'Hide' : 'Show'} Analysis
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => editEssay(currentEssay)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {currentEssay.college && (
                    <>
                      <span>{currentEssay.college}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{currentEssay.wordCount} words</span>
                  <Badge variant={currentEssay.status === 'published' ? 'default' : 'secondary'}>
                    {currentEssay.status}
                  </Badge>
                  <Badge variant={currentEssay.visibility === 'public' ? 'default' : 'secondary'}>
                    {currentEssay.visibility}
                  </Badge>
                  <span>Updated {new Date(currentEssay.updatedAt).toLocaleDateString()}</span>
                </div>
                {currentEssay.content && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Content:</p>
                    <p className="text-sm">{currentEssay.content}</p>
                  </div>
                )}
                 {currentEssay.prompt && (
                   <div className="mt-2 p-3 bg-muted/50 rounded-md">
                     <p className="text-sm font-medium text-muted-foreground mb-1">Prompt:</p>
                     <p className="text-sm">{currentEssay.prompt}</p>
                   </div>
                 )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {/* <TabsTrigger value="essay">Essay</TabsTrigger> */}
                    {currentEssay.visibility === 'public' && (
                      <>
                        <TabsTrigger value="interactions">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            {likeStatus.ratingCount}
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="comments">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {comments.length}
                          </div>
                        </TabsTrigger>
                      </>
                    )}
                    <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                  </TabsList>
                  
                  {/* <TabsContent value="essay" className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {currentEssay.content}
                      </pre>
                    </div>
                  </TabsContent> */}

                  {currentEssay.visibility === 'public' && (
                    <>
                      <TabsContent value="interactions" className="mt-4">
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Rate this essay:</span>
                                <StarRating
                                  rating={likeStatus.userRating || 0}
                                  onRatingChange={(rating) => handleRatingChange(currentEssay.id, rating)}
                                  size="md"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Average:</span>
                                <StarRatingDisplay
                                  rating={likeStatus.avgRating}
                                  size="sm"
                                  showScore={true}
                                />
                                <span className="text-sm text-muted-foreground">
                                  ({likeStatus.ratingCount} {likeStatus.ratingCount === 1 ? 'rating' : 'ratings'})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="comments" className="mt-4">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {comments.map((comment) => (
                              <div key={comment.id} className="p-3 bg-muted/50 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))}
                            {comments.length === 0 && (
                              <p className="text-center text-muted-foreground py-4">
                                No comments yet. Be the first to comment!
                              </p>
                            )}
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1"
                                rows={3}
                              />
                              <Button
                                onClick={() => postComment(currentEssay.id)}
                                disabled={!newComment.trim() || isPostingComment}
                                className="self-end"
                              >
                                {isPostingComment ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MessageCircle className="w-4 h-4" />
                                )}
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </>
                  )}
                  
                  <TabsContent value="analysis" className="mt-4">
                    {analysis ? (
                      <div className="space-y-6">
                        {/* Analysis Header with Redo Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={analysis.success ? 'default' : 'secondary'}>
                              {analysis.model_used}
                            </Badge>
                            {analysis.note && (
                              <Badge variant="outline">{analysis.note}</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              Analyzed on {existingFeedback ? new Date(existingFeedback.created_at).toLocaleDateString() : 'Unknown date'}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => analyzeEssay(currentEssay.id)}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2"
                          >
                            {isAnalyzing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                            {isAnalyzing ? 'Analyzing...' : 'Redo Analysis'}
                          </Button>
                        </div>

                        {/* Evaluation Scores as Dials */}
                        {evaluationScores && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Evaluation Scores</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {[
                                { key: 'flow', label: 'Flow', value: evaluationScores.flow },
                                { key: 'hook', label: 'Hook', value: evaluationScores.hook },
                                { key: 'voice', label: 'Voice', value: evaluationScores.voice },
                                { key: 'uniqueness', label: 'Uniqueness', value: evaluationScores.uniqueness },
                                { key: 'conciseness', label: 'Conciseness', value: evaluationScores.conciseness },
                                { key: 'authenticity', label: 'Authenticity', value: evaluationScores.authenticity }
                              ].map(({ key, label, value }) => (
                                <div key={key} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{label}</span>
                                    <span className="text-sm text-muted-foreground">{value}/10</span>
                                  </div>
                                  <Progress value={value * 10} className="h-2" />
                                </div>
                              ))}
                              {evaluationScores.overall && (
                                <div className="col-span-2 md:col-span-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Overall Score</span>
                                    <span className="text-lg font-semibold text-accent">
                                      {evaluationScores.overall.toFixed(1)}/10
                                    </span>
                                  </div>
                                  <Progress value={evaluationScores.overall * 10} className="h-3" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Analysis Content */}
                        <div className="prose prose-sm max-w-none">
                          <h4 className="text-lg font-semibold mb-3">Analysis</h4>
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/50 p-4 rounded-md">
                            {analysis.analysis}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No analysis yet. Click the brain icon to analyze this essay!</p>
                        <Button
                          onClick={() => analyzeEssay(currentEssay.id)}
                          disabled={isAnalyzing}
                          className="mt-4"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Brain className="w-4 h-4 mr-2" />
                          )}
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Essay'}
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Essay Selected</h3>
              <p>Choose an essay from the list or create a new one to get started.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

