"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Search, Filter, TrendingUp, Users, BookOpen, Loader2, Heart, MessageCircle, UserPlus, X, Eye, Brain } from "lucide-react"
import { StarRating, StarRatingDisplay } from "@/components/ui/star-rating"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Navigation from "@/components/navigation"
import { UserButton } from "@/components/user-button"
import { toast } from 'sonner'
import Link from 'next/link'

interface Essay {
  id: string
  title: string
  content: string
  wordCount: number
  college?: string
  prompt?: string
  visibility: string
  status: string
  author: string
  authorId?: string
  ratingCount: number
  avgRating: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  essaysCount: number
  followersCount: number
  followingCount: number
  avgRating: number
  joinDate: string
}

interface TopCollege {
  college: string
  essayCount: number
  avgRating: number
}

interface PopularTopic {
  tag: string
  essayCount: number
  avgRating: number
}

interface RisingWriter {
  id: string
  username: string
  displayName: string
  essaysCount: number
  followersCount: number
  avgRating: number
  recentEssays: number
}

interface EssayModal {
  essay: Essay | null
  isOpen: boolean
  isLoading: boolean
}

interface EssayAnalysis {
  analysis: string
  model_used: string
  success: boolean
  note?: string
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

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("essays")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    college: "all",
    status: "published",
    visibility: "public",
    rating: [0],
    dateRange: "all",
    tags: [] as string[],
  })
  
  const [searchResults, setSearchResults] = useState({
    essays: [] as Essay[],
    users: [] as User[],
  })
  
  const [trendingData, setTrendingData] = useState({
    topColleges: [] as TopCollege[],
    popularTopics: [] as PopularTopic[],
    risingWriters: [] as RisingWriter[],
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isTrendingLoading, setIsTrendingLoading] = useState(true)
  const [availableColleges, setAvailableColleges] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  
  // Essay modal state
  const [essayModal, setEssayModal] = useState<EssayModal>({
    essay: null,
    isOpen: false,
    isLoading: false
  })
  const [essayAnalysis, setEssayAnalysis] = useState<EssayAnalysis | null>(null)
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScores | null>(null)
  const [essayComments, setEssayComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [essayLikeStatus, setEssayLikeStatus] = useState({ ratingCount: 0, userRating: null as number | null, avgRating: 0 })
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({})

  // Fetch trending data on component mount
  useEffect(() => {
    fetchTrendingData()
    fetchAvailableFilters()
    // Perform initial search to show some results
    handleSearch('')
  }, [])

  // Add fallback data for when there are no results yet
  const getFallbackData = () => {
    return {
      topColleges: [
        { college: "Harvard", essayCount: 0, avgRating: 0 },
        { college: "MIT", essayCount: 0, avgRating: 0 },
        { college: "Stanford", essayCount: 0, avgRating: 0 },
        { college: "Yale", essayCount: 0, avgRating: 0 }
      ],
      popularTopics: [
        { tag: "Personal Statement", essayCount: 0, avgRating: 0 },
        { tag: "Why This Major", essayCount: 0, avgRating: 0 },
        { tag: "Community Service", essayCount: 0, avgRating: 0 },
        { tag: "Leadership", essayCount: 0, avgRating: 0 }
      ],
      risingWriters: [
        { id: "1", username: "user1", displayName: "New Writer", essaysCount: 0, followersCount: 0, avgRating: 0, recentEssays: 0 },
        { id: "2", username: "user2", displayName: "Another Writer", essaysCount: 0, followersCount: 0, avgRating: 0, recentEssays: 0 }
      ]
    }
  }

  const fetchTrendingData = async () => {
    try {
      setIsTrendingLoading(true)
      
      // Fetch top colleges
      const collegesResponse = await fetch('/api/search/trending?type=colleges')
      const collegesData = await collegesResponse.json()
      
      // Fetch popular topics
      const topicsResponse = await fetch('/api/search/trending?type=topics')
      const topicsData = await topicsResponse.json()
      
      // Fetch rising writers
      const writersResponse = await fetch('/api/search/trending?type=writers')
      const writersData = await writersResponse.json()
      
      setTrendingData({
        topColleges: collegesData.colleges || [],
        popularTopics: topicsData.topics || [],
        risingWriters: writersData.writers || [],
      })

      // Check follow status for rising writers
      const risingWriterIds = (writersData.writers || []).map(writer => writer.id).filter(Boolean)
      for (const writerId of risingWriterIds) {
        await checkFollowStatus(writerId)
      }
    } catch (error) {
      console.error('Error fetching trending data:', error)
    } finally {
      setIsTrendingLoading(false)
    }
  }

  const fetchAvailableFilters = async () => {
    try {
      const response = await fetch('/api/search/filters')
      const data = await response.json()
      setAvailableColleges(data.colleges || [])
      setAvailableTags(data.tags || [])
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    
    try {
      // Build search parameters, only including non-empty values
      const searchParams = new URLSearchParams()
      
      if (query.trim()) {
        searchParams.set('q', query.trim())
      }
      
      searchParams.set('type', activeTab === 'essays' ? 'essays' : 'users')
      
      if (filters.status && filters.status !== 'published') {
        searchParams.set('status', filters.status)
      }
      
      if (filters.visibility && filters.visibility !== 'public') {
        searchParams.set('visibility', filters.visibility)
      }
      
      if (filters.rating[0] > 0) {
        searchParams.set('minRating', filters.rating[0].toString())
      }
      
      if (filters.college && filters.college !== 'all') {
        searchParams.set('college', filters.college)
      }
      
      if (filters.tags.length > 0) {
        searchParams.set('tags', filters.tags.join(','))
      }
      
      if (filters.dateRange && filters.dateRange !== 'all') {
        searchParams.set('dateRange', filters.dateRange)
      }
      
      console.log('Search params:', searchParams.toString())
      
      const response = await fetch(`/api/search?${searchParams}`)
      const data = await response.json()
      
      console.log('Search response:', data)
      
      setSearchResults({
        essays: data.essays || [],
        users: data.users || [],
      })

      // Check follow status for all authors
      const allAuthors = [
        ...(data.essays || []).map(essay => essay.authorId).filter(Boolean),
        ...(data.users || []).map(user => user.id).filter(Boolean)
      ]
      
      // Check follow status for unique authors
      const uniqueAuthors = [...new Set(allAuthors)]
      for (const authorId of uniqueAuthors) {
        await checkFollowStatus(authorId)
      }
    } catch (error) {
      console.error('Error searching:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const openEssayModal = async (essay: Essay) => {
    setEssayModal({ essay, isOpen: true, isLoading: true })
    
    try {
      // Fetch essay analysis
      const analysisResponse = await fetch(`/api/essays/${essay.id}/feedback`)
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json()
        if (analysisData.feedback && analysisData.feedback.length > 0) {
          const latestFeedback = analysisData.feedback[0]
          setEssayAnalysis({
            analysis: latestFeedback.general_comment,
            model_used: latestFeedback.model_name,
            success: true,
            note: latestFeedback.provider === 'ai' ? 'AI Analysis' : 'Human Feedback'
          })
          
          // Fetch evaluation scores
          const scoresResponse = await fetch(`/api/essays/${essay.id}/feedback/${latestFeedback.id}/scores`)
          if (scoresResponse.ok) {
            const scoresData = await scoresResponse.json()
            if (scoresData.scores) {
              setEvaluationScores(scoresData.scores)
            }
          }
        }
      }
      
      // Fetch comments
      const commentsResponse = await fetch(`/api/essays/${essay.id}/comments`)
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setEssayComments(commentsData.comments || [])
      }
      
      // Fetch like status
      const likeResponse = await fetch(`/api/essays/${essay.id}/like`)
      if (likeResponse.ok) {
        const likeData = await likeResponse.json()
        setEssayLikeStatus({
          ratingCount: likeData.ratingCount || 0,
          userRating: likeData.userRating,
          avgRating: likeData.avgRating || 0
        })
      }
    } catch (error) {
      console.error('Error fetching essay data:', error)
    } finally {
      setEssayModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  const closeEssayModal = () => {
    setEssayModal({ essay: null, isOpen: false, isLoading: false })
    setEssayAnalysis(null)
    setEvaluationScores(null)
    setEssayComments([])
    setNewComment('')
    setEssayLikeStatus({ ratingCount: 0, userRating: null, avgRating: 0 })
  }

  const handleEssayRatingChange = async (newRating: number) => {
    if (!essayModal.essay) return
    
    try {
      const response = await fetch(`/api/essays/${essayModal.essay.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: newRating })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state
        setEssayLikeStatus(prev => ({ 
          ratingCount: data.rated ? prev.ratingCount : prev.ratingCount - 1, 
          userRating: data.rated ? newRating : null, 
          avgRating: prev.avgRating 
        }))
        
        // Refresh the rating data to get updated averages
        const likeResponse = await fetch(`/api/essays/${essayModal.essay.id}/like`)
        if (likeResponse.ok) {
          const likeData = await likeResponse.json()
          setEssayLikeStatus(prev => ({
            ...prev,
            ratingCount: likeData.ratingCount || 0,
            avgRating: likeData.avgRating || 0
          }))
        }
        
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

  const postEssayComment = async () => {
    if (!essayModal.essay || !newComment.trim()) return

    try {
      setIsPostingComment(true)
      const response = await fetch(`/api/essays/${essayModal.essay.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setNewComment('')
          // Refresh comments
          const commentsResponse = await fetch(`/api/essays/${essayModal.essay.id}/comments`)
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json()
            setEssayComments(commentsData.comments || [])
          }
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

  const checkFollowStatus = async (authorId: string) => {
    try {
      const response = await fetch(`/api/follow?followeeId=${authorId}`)
      if (response.ok) {
        const data = await response.json()
        setFollowStatus(prev => ({
          ...prev,
          [authorId]: data.isFollowing
        }))
      }
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const followAuthor = async (authorId: string) => {
    try {
      const isCurrentlyFollowing = followStatus[authorId]
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST'
      const url = isCurrentlyFollowing 
        ? `/api/follow?followeeId=${authorId}`
        : '/api/follow'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ followeeId: authorId }) : undefined
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const action = isCurrentlyFollowing ? 'unfollowed' : 'followed'
          toast.success(`Successfully ${action} author!`)
          
          // Update follow status
          setFollowStatus(prev => ({
            ...prev,
            [authorId]: !isCurrentlyFollowing
          }))
          
          // Refresh search results to update follower counts
          handleSearch(searchQuery)
        } else {
          toast.error(data.error || `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} author`)
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} author`)
      }
    } catch (error) {
      console.error('Error following/unfollowing author:', error)
      toast.error('Failed to follow/unfollow author')
    }
  }

  const applyFilters = () => {
    handleSearch(searchQuery)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="text-2xl font-bold font-serif text-foreground">
              PeerPen
            </Link>
            <UserButton />
          </div>
          <Navigation />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Essays</h1>
          <p className="text-muted-foreground">Find inspiration from thousands of college essays</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search essays, topics, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="pl-10 pr-4 py-3 text-lg"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSearch(searchQuery)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Search Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">College</label>
                  <Select
                    value={filters.college}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, college: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any college</SelectItem>
                      {availableColleges.map((college) => (
                        <SelectItem key={college} value={college.toLowerCase()}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <Select
                    value={filters.visibility}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, visibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value }))}
                    max={5}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">{filters.rating[0].toFixed(1)}+ stars</div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any time</SelectItem>
                      <SelectItem value="week">Past week</SelectItem>
                      <SelectItem value="month">Past month</SelectItem>
                      <SelectItem value="year">Past year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <Button onClick={applyFilters} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="essays" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Essays ({searchResults.essays.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Writers ({searchResults.users.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="essays">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-6">
                {searchResults.essays.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No essays found matching your search criteria.</p>
                  </div>
                ) : (
                  searchResults.essays.map((essay) => (
                    <Card key={essay.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEssayModal(essay)}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-2 hover:text-accent">
                              {essay.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>by {essay.author}</span>
                              {essay.college && (
                                <>
                                  <span>•</span>
                                  <span>{essay.college}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>{new Date(essay.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <StarRatingDisplay
                              rating={essay.avgRating}
                              size="sm"
                              showScore={true}
                            />
                            <span className="text-muted-foreground">({essay.ratingCount})</span>
                          </div>
                        </div>

                        {essay.prompt && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            <span className="font-medium">Prompt:</span> {essay.prompt}
                          </p>
                        )}

                        <p className="text-foreground mb-4 line-clamp-3">
                          {essay.content.substring(0, 200)}...
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{essay.wordCount} words</span>
                            <span>•</span>
                            <span>{essay.commentCount} comments</span>
                          </div>
                          <Badge variant={essay.visibility === 'public' ? 'default' : 'secondary'}>
                            {essay.visibility}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {searchResults.users.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground col-span-2">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No writers found matching your search criteria.</p>
                  </div>
                ) : (
                  searchResults.users.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {user.displayName || user.username}
                            </h3>
                            {user.bio && (
                              <p className="text-muted-foreground text-sm mb-3">{user.bio}</p>
                            )}
                          </div>
                          <Button 
                            variant={followStatus[user.id] ? "default" : "outline"} 
                            size="sm"
                            onClick={() => followAuthor(user.id)}
                            onMouseEnter={() => checkFollowStatus(user.id)}
                          >
                            {followStatus[user.id] ? "Following" : "Follow"}
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-foreground">{user.essaysCount}</div>
                            <div className="text-xs text-muted-foreground">Essays</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-foreground">{user.followersCount}</div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <StarRatingDisplay
                              rating={user.avgRating}
                              size="sm"
                              showScore={false}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Trending Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
          </div>

          {isTrendingLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(trendingData.popularTopics.length > 0 ? trendingData.popularTopics : getFallbackData().popularTopics).slice(0, 6).map((topic) => (
                    <Badge key={topic.tag} variant="outline" className="cursor-pointer hover:bg-accent">
                      {topic.tag} ({topic.essayCount})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Colleges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(trendingData.topColleges.length > 0 ? trendingData.topColleges : getFallbackData().topColleges).map((college) => (
                    <div key={college.college} className="flex justify-between items-center">
                      <span className="text-sm">{college.college}</span>
                      <Badge variant="secondary" className="text-xs">
                        {college.essayCount} essays
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rising Writers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(trendingData.risingWriters.length > 0 ? trendingData.risingWriters : getFallbackData().risingWriters).slice(0, 3).map((writer) => (
                    <div key={writer.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{writer.displayName || writer.username}</div>
                        <div className="text-xs text-muted-foreground">{writer.followersCount} followers</div>
                      </div>
                      <Button 
                        variant={followStatus[writer.id] ? "default" : "outline"} 
                        size="sm"
                        onClick={() => followAuthor(writer.id)}
                        onMouseEnter={() => checkFollowStatus(writer.id)}
                      >
                        {followStatus[writer.id] ? "Following" : "Follow"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </div>
      </div>

      {/* Essay Modal */}
      <Dialog open={essayModal.isOpen} onOpenChange={closeEssayModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {essayModal.essay?.title}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={closeEssayModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {essayModal.essay && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>by {essayModal.essay.author}</span>
                {essayModal.essay.college && (
                  <>
                    <span>•</span>
                    <span>{essayModal.essay.college}</span>
                  </>
                )}
                <span>•</span>
                <span>{essayModal.essay.wordCount} words</span>
                <span>•</span>
                <span>{new Date(essayModal.essay.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </DialogHeader>

          {essayModal.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Essay Content */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Essay Content</h3>
                <div className="prose prose-sm max-w-none bg-muted/50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {essayModal.essay?.content}
                  </pre>
                </div>
              </div>

              {/* Essay Prompt */}
              {essayModal.essay?.prompt && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Essay Prompt</h3>
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="text-sm">{essayModal.essay.prompt}</p>
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {essayAnalysis && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis
                  </h3>
                  
                  {/* Evaluation Scores */}
                  {evaluationScores && (
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-3">Evaluation Scores</h4>
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

                  {/* Analysis Text */}
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default">{essayAnalysis.model_used}</Badge>
                      {essayAnalysis.note && (
                        <Badge variant="outline">{essayAnalysis.note}</Badge>
                      )}
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {essayAnalysis.analysis}
                    </pre>
                  </div>
                </div>
              )}

              {/* Interaction Section */}
              <div className="border-t pt-6">
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rate this essay:</span>
                      <StarRating
                        rating={essayLikeStatus.userRating || 0}
                        onRatingChange={handleEssayRatingChange}
                        size="md"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Average:</span>
                      <StarRatingDisplay
                        rating={essayLikeStatus.avgRating}
                        size="sm"
                        showScore={true}
                      />
                      <span className="text-sm text-muted-foreground">
                        ({essayLikeStatus.ratingCount} {essayLikeStatus.ratingCount === 1 ? 'rating' : 'ratings'})
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => followAuthor(essayModal.essay?.authorId || '')}
                    variant={followStatus[essayModal.essay?.authorId || ''] ? "default" : "outline"}
                    size="sm"
                    onMouseEnter={() => essayModal.essay?.authorId && checkFollowStatus(essayModal.essay.authorId)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {followStatus[essayModal.essay?.authorId || ''] ? "Following Author" : "Follow Author"}
                  </Button>
                </div>

                {/* Comments Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments ({essayComments.length})
                  </h4>
                  
                  <div className="space-y-3 mb-4">
                    {essayComments.map((comment) => (
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
                    {essayComments.length === 0 && (
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
                        onClick={postEssayComment}
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
