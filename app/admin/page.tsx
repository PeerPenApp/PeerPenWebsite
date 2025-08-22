"use client"


export const dynamic = 'force-dynamic'


import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for admin dashboard
const dashboardStats = {
  totalUsers: 2847,
  totalEssays: 1293,
  pendingReports: 23,
  activeReviews: 156,
  weeklyGrowth: {
    users: 12.5,
    essays: 8.3,
    reviews: 15.2,
  },
}

const mockReports = [
  {
    id: "1",
    type: "essay",
    contentId: "essay-123",
    contentTitle: "My Journey to Computer Science",
    reportedBy: "user-456",
    reason: "Inappropriate content",
    description: "Contains offensive language",
    status: "pending",
    createdAt: "2024-01-20T10:30:00Z",
    priority: "high",
  },
  {
    id: "2",
    type: "review",
    contentId: "review-789",
    contentTitle: "Review on 'Why I Want to Study Medicine'",
    reportedBy: "user-321",
    reason: "Spam",
    description: "Repetitive and unhelpful feedback",
    status: "pending",
    createdAt: "2024-01-20T09:15:00Z",
    priority: "medium",
  },
]

const mockUsers = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@example.com",
    status: "active",
    essays: 5,
    reviews: 23,
    reports: 0,
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    status: "active",
    essays: 8,
    reviews: 31,
    reports: 1,
    joinDate: "2024-01-10",
    lastActive: "2024-01-19",
  },
]

const mockEssays = [
  {
    id: "1",
    title: "Why I Want to Study Computer Science",
    author: "Alex Chen",
    status: "published",
    reports: 1,
    views: 234,
    reviews: 12,
    rating: 4.8,
    createdAt: "2024-01-18",
    flagged: true,
  },
  {
    id: "2",
    title: "The Day I Failed Forward",
    author: "Anonymous",
    status: "published",
    reports: 0,
    views: 189,
    reviews: 8,
    rating: 4.6,
    createdAt: "2024-01-17",
    flagged: false,
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleReportAction = (reportId: string, action: "approve" | "reject") => {
    console.log(`[v0] Report ${reportId} ${action}ed`)
    // In real app, this would update the report status
  }

  const handleUserAction = (userId: string, action: "suspend" | "ban" | "activate") => {
    console.log(`[v0] User ${userId} ${action}ed`)
    // In real app, this would update the user status
  }

  const handleEssayAction = (essayId: string, action: "hide" | "delete" | "approve") => {
    console.log(`[v0] Essay ${essayId} ${action}ed`)
    // In real app, this would update the essay status
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage content, users, and platform moderation</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">
              Reports
              {dashboardStats.pendingReports > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {dashboardStats.pendingReports}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+{dashboardStats.weeklyGrowth.users}% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalEssays.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+{dashboardStats.weeklyGrowth.essays}% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.pendingReports}</div>
                  <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.activeReviews}</div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardStats.weeklyGrowth.reviews}% from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{report.contentTitle}</div>
                          <div className="text-xs text-muted-foreground">{report.reason}</div>
                        </div>
                        <Badge variant={report.priority === "high" ? "destructive" : "secondary"}>
                          {report.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Content Quality Score</span>
                      <Badge variant="default">94%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Satisfaction</span>
                      <Badge variant="default">4.7/5</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moderation Response Time</span>
                      <Badge variant="default">2.3h</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Moderators</span>
                      <Badge variant="default">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {mockReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{report.type}</Badge>
                            <Badge variant={report.priority === "high" ? "destructive" : "secondary"}>
                              {report.priority}
                            </Badge>
                            <Badge variant="outline">{report.status}</Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{report.contentTitle}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reported by: {report.reportedBy} • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Reason:</span> {report.reason}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Description:</span> {report.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "approve")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReportAction(report.id, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b">
                        <tr className="text-left">
                          <th className="p-4 font-medium">User</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium">Essays</th>
                          <th className="p-4 font-medium">Reviews</th>
                          <th className="p-4 font-medium">Reports</th>
                          <th className="p-4 font-medium">Join Date</th>
                          <th className="p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4">{user.essays}</td>
                            <td className="p-4">{user.reviews}</td>
                            <td className="p-4">
                              {user.reports > 0 ? (
                                <Badge variant="destructive">{user.reports}</Badge>
                              ) : (
                                <span className="text-muted-foreground">0</span>
                              )}
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleUserAction(user.id, "suspend")}>
                                    Suspend User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUserAction(user.id, "ban")}>
                                    Ban User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search content..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter content" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {mockEssays.map((essay) => (
                  <Card key={essay.id} className={essay.flagged ? "border-red-200" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{essay.status}</Badge>
                            {essay.flagged && <Badge variant="destructive">Flagged</Badge>}
                            {essay.reports > 0 && <Badge variant="secondary">{essay.reports} reports</Badge>}
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{essay.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {essay.author} • {new Date(essay.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{essay.views} views</span>
                            <span>{essay.reviews} reviews</span>
                            <span>Rating: {essay.rating}/5</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleEssayAction(essay.id, "approve")}>
                                Approve Content
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEssayAction(essay.id, "hide")}>
                                Hide Content
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEssayAction(essay.id, "delete")}>
                                Delete Content
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
