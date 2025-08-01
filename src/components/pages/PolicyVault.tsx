import React, { useState } from 'react'
import { 
  FileText, 
  Upload, 
  Download, 
  Search,
  Filter,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const policies = [
  {
    id: 1,
    name: 'Screen Time Policy',
    type: 'Screen Time',
    description: 'Daily screen time limits for children',
    status: 'active',
    lastUpdated: '2024-01-15',
    expiresOn: '2024-12-31',
    tags: ['children', 'screen-time'],
    appliesTo: ['Emma', 'Alex']
  },
  {
    id: 2,
    name: 'App Approval Policy',
    type: 'App Management',
    description: 'Parental approval required for new app installations',
    status: 'active',
    lastUpdated: '2024-01-10',
    expiresOn: null,
    tags: ['apps', 'parental-control'],
    appliesTo: ['Emma', 'Alex']
  },
  {
    id: 3,
    name: 'Privacy Settings',
    type: 'Privacy',
    description: 'Family privacy and data sharing preferences',
    status: 'draft',
    lastUpdated: '2024-01-20',
    expiresOn: null,
    tags: ['privacy', 'data-protection'],
    appliesTo: ['All Family Members']
  },
  {
    id: 4,
    name: 'Gaming Time Limits',
    type: 'Gaming',
    description: 'Console and online gaming time restrictions',
    status: 'active',
    lastUpdated: '2024-01-12',
    expiresOn: '2024-06-30',
    tags: ['gaming', 'time-limits'],
    appliesTo: ['Alex']
  }
]

const documents = [
  {
    id: 1,
    name: 'Netflix Terms of Service',
    type: 'Terms & Conditions',
    uploadDate: '2024-01-18',
    expiresOn: null,
    size: '2.4 MB',
    tags: ['netflix', 'terms'],
    status: 'current'
  },
  {
    id: 2,
    name: 'School Internet Policy',
    type: 'Policy Document',
    uploadDate: '2024-01-15',
    expiresOn: '2024-08-31',
    size: '1.2 MB',
    tags: ['school', 'internet-policy'],
    status: 'expiring-soon'
  },
  {
    id: 3,
    name: 'PlayStation Purchase Receipt',
    type: 'Receipt',
    uploadDate: '2024-01-10',
    expiresOn: null,
    size: '0.8 MB',
    tags: ['gaming', 'receipt'],
    status: 'current'
  },
  {
    id: 4,
    name: 'Home WiFi Contract',
    type: 'Contract',
    uploadDate: '2023-12-20',
    expiresOn: '2024-12-20',
    size: '3.1 MB',
    tags: ['internet', 'contract'],
    status: 'current'
  },
  {
    id: 5,
    name: 'Old Privacy Policy',
    type: 'Policy Document',
    uploadDate: '2023-06-15',
    expiresOn: '2024-01-15',
    size: '1.5 MB',
    tags: ['privacy', 'outdated'],
    status: 'expired'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'current':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'draft':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'expiring-soon':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
    case 'current':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'draft':
      return <Edit className="w-4 h-4 text-blue-600" />
    case 'expiring-soon':
      return <Clock className="w-4 h-4 text-yellow-600" />
    case 'expired':
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    default:
      return <FileText className="w-4 h-4 text-gray-600" />
  }
}

export function PolicyVault() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false)

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const policyStats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    draft: policies.filter(p => p.status === 'draft').length,
  }

  const documentStats = {
    total: documents.length,
    current: documents.filter(d => d.status === 'current').length,
    expiring: documents.filter(d => d.status === 'expiring-soon').length,
    expired: documents.filter(d => d.status === 'expired').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Policy & Document Vault</h1>
          <p className="text-slate-600 mt-1">Manage family policies and important documents</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
                <DialogDescription>
                  Set up a new family policy to manage digital safety and usage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="policy-name">Policy Name</Label>
                    <Input id="policy-name" placeholder="e.g., Weekend Screen Time" />
                  </div>
                  <div>
                    <Label htmlFor="policy-type">Policy Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="screen-time">Screen Time</SelectItem>
                        <SelectItem value="app-management">App Management</SelectItem>
                        <SelectItem value="privacy">Privacy</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="internet">Internet Usage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="policy-description">Description</Label>
                  <Textarea 
                    id="policy-description" 
                    placeholder="Describe what this policy covers..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applies-to">Applies To</Label>
                    <Input id="applies-to" placeholder="Family members" />
                  </div>
                  <div>
                    <Label htmlFor="expires-on">Expires On (Optional)</Label>
                    <Input id="expires-on" type="date" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsPolicyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsPolicyDialogOpen(false)}>
                    Create Policy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add important documents to your family vault
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File</Label>
                  <Input id="file-upload" type="file" />
                </div>
                <div>
                  <Label htmlFor="doc-name">Document Name</Label>
                  <Input id="doc-name" placeholder="e.g., Netflix Terms of Service" />
                </div>
                <div>
                  <Label htmlFor="doc-type">Document Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terms">Terms & Conditions</SelectItem>
                      <SelectItem value="policy">Policy Document</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="netflix, terms, streaming" />
                  </div>
                  <div>
                    <Label htmlFor="expires">Expires On (Optional)</Label>
                    <Input id="expires" type="date" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsUploadDialogOpen(false)}>
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search policies and documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{policyStats.total}</div>
            <p className="text-sm text-slate-600">Total Policies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{policyStats.active}</div>
            <p className="text-sm text-slate-600">Active Policies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{documentStats.total}</div>
            <p className="text-sm text-slate-600">Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{documentStats.expiring + documentStats.expired}</div>
            <p className="text-sm text-slate-600">Need Attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Policies and Documents */}
      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="policies">Family Policies ({policies.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{policy.name}</h3>
                        <Badge className={getStatusColor(policy.status)}>
                          {getStatusIcon(policy.status)}
                          <span className="ml-1 capitalize">{policy.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{policy.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {policy.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Updated: {policy.lastUpdated}</span>
                        {policy.expiresOn && (
                          <span>Expires: {policy.expiresOn}</span>
                        )}
                        <span>Applies to: {policy.appliesTo.join(', ')}</span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Policy
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusIcon(doc.status)}
                            <span className="ml-1 capitalize">{doc.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{doc.type} • {doc.size}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Uploaded: {doc.uploadDate}</span>
                          {doc.expiresOn && (
                            <span>Expires: {doc.expiresOn}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}