import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModernIcon, ModernIconContainer } from '@/components/ui/ModernIcon'
import type { Page } from '@/App'

interface AppSidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
  onStartOnboarding: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    iconType: 'home' as const,
    id: 'dashboard' as Page,
  },
  {
    title: 'Devices & Services',
    iconType: 'shield-check' as const,
    id: 'inventory' as Page,
  },
  {
    title: 'Policy & Vault',
    iconType: 'file-text' as const,
    id: 'policy-vault' as Page,
  },
  {
    title: 'Settings',
    iconType: 'settings' as const,
    id: 'settings' as Page,
  },
]

export function AppSidebar({ currentPage, onPageChange, onStartOnboarding }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <ModernIconContainer size="lg" background="gradient" variant="rounded">
            <ModernIcon type="shield-check" size="lg" color="primary" />
          </ModernIconContainer>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">HAVEN</h1>
            <p className="text-sm text-slate-500">Family Protection</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.id)}
                    isActive={currentPage === item.id}
                    className="w-full justify-start gap-3"
                  >
                    <ModernIcon 
                      type={item.iconType} 
                      size="sm" 
                      color={currentPage === item.id ? "primary" : "default"}
                      animated
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              <Button 
                onClick={onStartOnboarding}
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-3"
              >
                <ModernIcon type="sparkles" size="sm" color="warning" animated />
                Setup Wizard
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <ModernIconContainer size="sm" background="light" variant="circle">
              <ModernIcon type="award" size="sm" color="success" />
            </ModernIconContainer>
            <span className="text-sm font-medium text-green-800">Protection Level</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
            <ModernIcon type="gem" size="xs" color="success" className="mr-1" />
            Silver Shield
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}