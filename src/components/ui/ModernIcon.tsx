import React from 'react'
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  User,
  UserCheck,
  Wifi, 
  WifiOff,
  Smartphone, 
  Laptop, 
  Monitor,
  Tv,
  Bell, 
  BellRing,
  Brain, 
  Zap,
  Home,
  Network,
  Lock,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Settings,
  SettingsIcon,
  Search,
  Scan,
  Target,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  Calendar,
  FileText,
  Folder,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Camera,
  Image,
  Video,
  Mail,
  MessageCircle,
  Phone,
  Globe,
  MapPin,
  Navigation,
  Compass,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Menu,
  MoreHorizontal,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  X,
  Check,
  HelpCircle,
  AlertOctagon,
  Flame,
  Sparkles,
  Lightbulb,
  Rocket,
  Crown,
  Gem,
  Heart,
  ThumbsUp,
  Share,
  ExternalLink,
  Link,
  Copy,
  Trash2,
  Edit3,
  Save,
  Database,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  Fingerprint,
  Key,
  QrCode,
  ScanLine,
  Layers,
  Package,
  Box,
  Boxes
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Modern icon variants with enhanced styling
export type ModernIconType = 
  // Security & Protection
  | 'shield' | 'shield-check' | 'shield-alert' | 'lock' | 'lock-keyhole' | 'fingerprint' | 'key' | 'scan-line'
  // Users & Family
  | 'users' | 'user' | 'user-check' | 'crown' | 'heart'
  // Devices & Technology
  | 'wifi' | 'wifi-off' | 'smartphone' | 'laptop' | 'monitor' | 'tv' | 'network' | 'database' | 'server' | 'cloud'
  // Notifications & Alerts
  | 'bell' | 'bell-ring' | 'alert-triangle' | 'alert-circle' | 'alert-octagon' | 'info' | 'check-circle' | 'check-circle-2'
  // AI & Intelligence
  | 'brain' | 'lightbulb' | 'sparkles' | 'rocket' | 'flame'
  // Navigation & Actions
  | 'home' | 'search' | 'scan' | 'target' | 'settings' | 'menu' | 'filter' | 'refresh' | 'play' | 'pause'
  // Data & Analytics
  | 'activity' | 'bar-chart' | 'pie-chart' | 'trending-up' | 'trending-down' | 'award' | 'star' | 'gem'
  // Time & Calendar
  | 'clock' | 'calendar'
  // Files & Documents
  | 'file-text' | 'folder' | 'download' | 'upload' | 'save'
  // Communication
  | 'mail' | 'message-circle' | 'phone' | 'globe' | 'share' | 'link'
  // Interface
  | 'eye' | 'eye-off' | 'plus' | 'minus' | 'x' | 'check' | 'help-circle' | 'external-link' | 'copy' | 'edit' | 'trash'
  // Directions
  | 'chevron-up' | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right'
  // Layout
  | 'grid' | 'list' | 'layers' | 'package' | 'box'

const iconMap: Record<ModernIconType, React.ComponentType<any>> = {
  // Security & Protection
  'shield': Shield,
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'lock': Lock,
  'lock-keyhole': LockKeyhole,
  'fingerprint': Fingerprint,
  'key': Key,
  'scan-line': ScanLine,
  
  // Users & Family
  'users': Users,
  'user': User,
  'user-check': UserCheck,
  'crown': Crown,
  'heart': Heart,
  
  // Devices & Technology
  'wifi': Wifi,
  'wifi-off': WifiOff,
  'smartphone': Smartphone,
  'laptop': Laptop,
  'monitor': Monitor,
  'tv': Tv,
  'network': Network,
  'database': Database,
  'server': Server,
  'cloud': Cloud,
  
  // Notifications & Alerts
  'bell': Bell,
  'bell-ring': BellRing,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'alert-octagon': AlertOctagon,
  'info': Info,
  'check-circle': CheckCircle,
  'check-circle-2': CheckCircle2,
  
  // AI & Intelligence
  'brain': Brain,
  'lightbulb': Lightbulb,
  'sparkles': Sparkles,
  'rocket': Rocket,
  'flame': Flame,
  
  // Navigation & Actions
  'home': Home,
  'search': Search,
  'scan': Scan,
  'target': Target,
  'settings': Settings,
  'menu': Menu,
  'filter': Filter,
  'refresh': RefreshCw,
  'play': Play,
  'pause': Pause,
  
  // Data & Analytics
  'activity': Activity,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'award': Award,
  'star': Star,
  'gem': Gem,
  
  // Time & Calendar
  'clock': Clock,
  'calendar': Calendar,
  
  // Files & Documents
  'file-text': FileText,
  'folder': Folder,
  'download': Download,
  'upload': Upload,
  'save': Save,
  
  // Communication
  'mail': Mail,
  'message-circle': MessageCircle,
  'phone': Phone,
  'globe': Globe,
  'share': Share,
  'link': Link,
  
  // Interface
  'eye': Eye,
  'eye-off': EyeOff,
  'plus': Plus,
  'minus': Minus,
  'x': X,
  'check': Check,
  'help-circle': HelpCircle,
  'external-link': ExternalLink,
  'copy': Copy,
  'edit': Edit3,
  'trash': Trash2,
  
  // Directions
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  
  // Layout
  'grid': Grid3X3,
  'list': List,
  'layers': Layers,
  'package': Package,
  'box': Box,
}

export type ModernIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ModernIconVariant = 'default' | 'outline' | 'filled' | 'gradient' | 'glass' | 'neon'
export type ModernIconColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

interface ModernIconProps {
  type: ModernIconType
  size?: ModernIconSize
  variant?: ModernIconVariant
  color?: ModernIconColor
  animated?: boolean
  className?: string
  onClick?: () => void
}

const sizeClasses: Record<ModernIconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
}

const colorClasses: Record<ModernIconColor, string> = {
  default: 'text-gray-600',
  primary: 'text-blue-600',
  secondary: 'text-purple-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-cyan-600',
  muted: 'text-gray-400',
}

const variantClasses: Record<ModernIconVariant, string> = {
  default: '',
  outline: 'stroke-2',
  filled: 'fill-current',
  gradient: 'bg-gradient-to-br from-current to-current/80 bg-clip-text text-transparent',
  glass: 'backdrop-blur-sm bg-white/10 rounded-full p-2 border border-white/20',
  neon: 'drop-shadow-[0_0_8px_currentColor] filter',
}

export function ModernIcon({ 
  type, 
  size = 'md', 
  variant = 'default', 
  color = 'default',
  animated = false,
  className,
  onClick 
}: ModernIconProps) {
  const IconComponent = iconMap[type]
  
  if (!IconComponent) {
    console.warn(`ModernIcon: Unknown icon type "${type}"`)
    return null
  }

  const baseClasses = cn(
    sizeClasses[size],
    colorClasses[color],
    variantClasses[variant],
    animated && 'transition-all duration-300 hover:scale-110',
    onClick && 'cursor-pointer hover:opacity-80',
    className
  )

  return (
    <IconComponent 
      className={baseClasses}
      onClick={onClick}
    />
  )
}

// Enhanced icon container with modern styling
interface ModernIconContainerProps {
  children: React.ReactNode
  size?: ModernIconSize
  variant?: 'circle' | 'square' | 'rounded' | 'none'
  background?: 'none' | 'light' | 'primary' | 'gradient' | 'glass'
  shadow?: boolean
  border?: boolean
  animated?: boolean
  className?: string
  onClick?: () => void
}

const containerSizeClasses: Record<ModernIconSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
}

const containerVariantClasses: Record<string, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
  none: '',
}

const containerBackgroundClasses: Record<string, string> = {
  none: '',
  light: 'bg-gray-50',
  primary: 'bg-blue-50',
  gradient: 'bg-gradient-to-br from-blue-50 to-purple-50',
  glass: 'backdrop-blur-sm bg-white/10 border border-white/20',
}

export function ModernIconContainer({
  children,
  size = 'md',
  variant = 'circle',
  background = 'light',
  shadow = true,
  border = false,
  animated = true,
  className,
  onClick
}: ModernIconContainerProps) {
  const containerClasses = cn(
    'flex items-center justify-center',
    containerSizeClasses[size],
    containerVariantClasses[variant],
    containerBackgroundClasses[background],
    shadow && 'shadow-sm',
    border && 'border border-gray-200',
    animated && 'transition-all duration-300 hover:scale-105 hover:shadow-md',
    onClick && 'cursor-pointer',
    className
  )

  return (
    <div className={containerClasses} onClick={onClick}>
      {children}
    </div>
  )
}

// Preset icon combinations for common use cases
export function SecurityIcon({ size = 'md', animated = true }: { size?: ModernIconSize; animated?: boolean }) {
  return (
    <ModernIconContainer size={size} background="gradient" animated={animated}>
      <ModernIcon type="shield-check" size={size} color="primary" animated={animated} />
    </ModernIconContainer>
  )
}

export function FamilyIcon({ size = 'md', animated = true }: { size?: ModernIconSize; animated?: boolean }) {
  return (
    <ModernIconContainer size={size} background="light" animated={animated}>
      <ModernIcon type="users" size={size} color="secondary" animated={animated} />
    </ModernIconContainer>
  )
}

export function AIIcon({ size = 'md', animated = true }: { size?: ModernIconSize; animated?: boolean }) {
  return (
    <ModernIconContainer size={size} background="gradient" animated={animated}>
      <ModernIcon type="brain" size={size} color="info" animated={animated} />
    </ModernIconContainer>
  )
}

export function NetworkIcon({ size = 'md', animated = true }: { size?: ModernIconSize; animated?: boolean }) {
  return (
    <ModernIconContainer size={size} background="light" animated={animated}>
      <ModernIcon type="wifi" size={size} color="success" animated={animated} />
    </ModernIconContainer>
  )
}

export function AlertIcon({ size = 'md', animated = true }: { size?: ModernIconSize; animated?: boolean }) {
  return (
    <ModernIconContainer size={size} background="light" animated={animated}>
      <ModernIcon type="bell-ring" size={size} color="warning" animated={animated} />
    </ModernIconContainer>
  )
}

export function DeviceIcon({ size = 'md', animated = true }: { size?: ModernIconSize; animated?: boolean }) {
  return (
    <ModernIconContainer size={size} background="light" animated={animated}>
      <ModernIcon type="smartphone" size={size} color="info" animated={animated} />
    </ModernIconContainer>
  )
}