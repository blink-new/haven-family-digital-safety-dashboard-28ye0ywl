import React, { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  type: 'particle' | 'data' | 'stream'
  life: number
  maxLife: number
}

interface DataStream {
  x: number
  y: number
  angle: number
  speed: number
  color: string
  opacity: number
  length: number
  segments: Array<{ x: number; y: number; opacity: number }>
}

const colors = {
  primary: ['#3B82F6', '#1D4ED8', '#2563EB'], // Blues
  secondary: ['#10B981', '#059669', '#047857'], // Greens
  accent: ['#F59E0B', '#D97706', '#B45309'], // Oranges
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9'], // Purples
  pink: ['#EC4899', '#DB2777', '#BE185D'], // Pinks
  cyan: ['#06B6D4', '#0891B2', '#0E7490'] // Cyans
}

export const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const dataStreamsRef = useRef<DataStream[]>([])

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const allColors = Object.values(colors).flat()
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: allColors[Math.floor(Math.random() * allColors.length)],
      opacity: Math.random() * 0.6 + 0.2,
      type: Math.random() > 0.7 ? 'data' : 'particle',
      life: 0,
      maxLife: Math.random() * 300 + 200
    }
  }, [])

  const createDataStream = useCallback((canvas: HTMLCanvasElement): DataStream => {
    const allColors = Object.values(colors).flat()
    const stream: DataStream = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 2 + 1,
      color: allColors[Math.floor(Math.random() * allColors.length)],
      opacity: Math.random() * 0.4 + 0.1,
      length: Math.random() * 50 + 30,
      segments: []
    }

    // Initialize segments
    for (let i = 0; i < stream.length; i++) {
      stream.segments.push({
        x: stream.x - Math.cos(stream.angle) * i * 2,
        y: stream.y - Math.sin(stream.angle) * i * 2,
        opacity: (stream.length - i) / stream.length * stream.opacity
      })
    }

    return stream
  }, [])

  const updateParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.life++

    // Fade out as life progresses
    particle.opacity = Math.max(0, (1 - particle.life / particle.maxLife) * 0.6)

    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.width
    if (particle.x > canvas.width) particle.x = 0
    if (particle.y < 0) particle.y = canvas.height
    if (particle.y > canvas.height) particle.y = 0

    // Add slight attraction to center for orbit effect
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const dx = centerX - particle.x
    const dy = centerY - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 0) {
      particle.vx += (dx / distance) * 0.001
      particle.vy += (dy / distance) * 0.001
    }

    return particle.life < particle.maxLife
  }

  const updateDataStream = (stream: DataStream, canvas: HTMLCanvasElement) => {
    // Move the head of the stream
    stream.x += Math.cos(stream.angle) * stream.speed
    stream.y += Math.sin(stream.angle) * stream.speed

    // Update all segments
    for (let i = stream.segments.length - 1; i > 0; i--) {
      stream.segments[i].x = stream.segments[i - 1].x
      stream.segments[i].y = stream.segments[i - 1].y
    }
    
    if (stream.segments.length > 0) {
      stream.segments[0].x = stream.x
      stream.segments[0].y = stream.y
    }

    // Wrap around edges
    if (stream.x < -50) {
      stream.x = canvas.width + 50
      stream.y = Math.random() * canvas.height
    }
    if (stream.x > canvas.width + 50) {
      stream.x = -50
      stream.y = Math.random() * canvas.height
    }
    if (stream.y < -50) {
      stream.y = canvas.height + 50
      stream.x = Math.random() * canvas.width
    }
    if (stream.y > canvas.height + 50) {
      stream.y = -50
      stream.x = Math.random() * canvas.width
    }

    // Occasionally change direction slightly
    if (Math.random() < 0.01) {
      stream.angle += (Math.random() - 0.5) * 0.2
    }

    return true
  }

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.globalAlpha = particle.opacity

    if (particle.type === 'data') {
      // Draw data particle as a small square with glow
      ctx.fillStyle = particle.color
      ctx.shadowBlur = 10
      ctx.shadowColor = particle.color
      ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size)
    } else {
      // Draw regular particle as a circle
      ctx.fillStyle = particle.color
      ctx.shadowBlur = 8
      ctx.shadowColor = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  const drawDataStream = (ctx: CanvasRenderingContext2D, stream: DataStream) => {
    if (stream.segments.length < 2) return

    ctx.save()
    ctx.strokeStyle = stream.color
    ctx.lineWidth = 2
    ctx.shadowBlur = 15
    ctx.shadowColor = stream.color

    // Draw the stream as connected segments
    ctx.beginPath()
    ctx.moveTo(stream.segments[0].x, stream.segments[0].y)

    for (let i = 1; i < stream.segments.length; i++) {
      const segment = stream.segments[i]
      ctx.globalAlpha = segment.opacity
      ctx.lineTo(segment.x, segment.y)
    }

    ctx.stroke()

    // Draw glowing dots at intervals
    for (let i = 0; i < stream.segments.length; i += 5) {
      const segment = stream.segments[i]
      ctx.globalAlpha = segment.opacity
      ctx.fillStyle = stream.color
      ctx.beginPath()
      ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      const alive = updateParticle(particle, canvas)
      if (alive) {
        drawParticle(ctx, particle)
      }
      return alive
    })

    // Update and draw data streams
    dataStreamsRef.current.forEach(stream => {
      updateDataStream(stream, canvas)
      drawDataStream(ctx, stream)
    })

    // Add new particles
    while (particlesRef.current.length < 80) {
      particlesRef.current.push(createParticle(canvas))
    }

    // Maintain data streams
    while (dataStreamsRef.current.length < 12) {
      dataStreamsRef.current.push(createDataStream(canvas))
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [createParticle, createDataStream])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    resizeCanvas()
    
    // Initialize particles and streams
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(createParticle(canvas))
    }
    
    for (let i = 0; i < 12; i++) {
      dataStreamsRef.current.push(createDataStream(canvas))
    }

    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, createDataStream, createParticle, resizeCanvas])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

export default BackgroundEffects