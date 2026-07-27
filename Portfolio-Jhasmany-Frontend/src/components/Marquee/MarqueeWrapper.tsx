'use client'
import { ReactNode, useEffect, useRef } from 'react'

type MarqueeWrapperProps = {
  children: ReactNode
  className?: string
}

type MarqueeAnimationType = (
  element: HTMLElement,
  elementWidth: number,
  windowWidth: number,
) => void

const marqueeAnimation: MarqueeAnimationType = (element, elementWidth, windowWidth) => {
  element.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(${windowWidth - elementWidth}px)` }],
    {
      duration: 20000,
      easing: 'linear',
      direction: 'alternate',
      iterations: Infinity,
    },
  )
}

const MarqueeWrapper: React.FC<MarqueeWrapperProps> = ({ children, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const animateMarquee = () => {
      if (!elementRef.current) {
        return
      }

      elementRef.current.getAnimations().forEach(animation => animation.cancel())
      const elementWidth = elementRef.current.getBoundingClientRect().width
      marqueeAnimation(elementRef.current, elementWidth, window.innerWidth)
    }

    animateMarquee()

    const handleResize = () => animateMarquee()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      elementRef.current?.getAnimations().forEach(animation => animation.cancel())
    }
  }, [])

  return (
    <div className={`relative overflow-x-hidden ${className}`}>
      <div className="inter w-max whitespace-nowrap p-5 lg:p-7" ref={elementRef}>
        {children}
      </div>
    </div>
  )
}

export default MarqueeWrapper
