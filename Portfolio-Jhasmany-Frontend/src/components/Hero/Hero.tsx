'use client'
import useRoleSwitcher from '@/hooks/useRoleSwitcher'
import useRotatingAnimation from '@/hooks/useRotatingAnimation'
import Image from 'next/image'
import { HeroImage } from '../../utils/images'
import Ellipse from './Ellipse'

interface HeroProps {
  greeting?: string
  roles?: string[]
  description?: string
  imageUrl?: string
  primaryButtonText?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
}

const Hero = ({
  greeting = "Hi - I'm Jhasmany Fernandez",
  roles = ['FULLSTACK DEVELOPER', 'INDIE HACKER', 'SOLOPRENEUR'],
  description = 'Crafting innovative solutions to solve real-world problems',
  imageUrl,
  primaryButtonText = 'Acceso Personal',
  primaryButtonUrl = '/auth/login',
  secondaryButtonText = 'Newsletter Clientes',
  secondaryButtonUrl = '/newsletter/subscribe',
}: HeroProps) => {
  const ellipseRef = useRotatingAnimation()
  const role = useRoleSwitcher({ roles })

  return (
    <section className="bg-primary bg-small-glow bg-small-glow-position md:bg-large-glow-position lg:bg-large-glow min-h-[calc(dvh-4rem)] bg-no-repeat">
      <div className="grid w-full grid-cols-1 items-center gap-8 px-[clamp(1rem,3vw,4rem)] pt-12 pb-10 md:grid-cols-[minmax(0,0.95fr)_minmax(18rem,1.05fr)] lg:py-6">
        <div className="flex min-h-48 max-w-[52rem] flex-col justify-between lg:min-h-64">
          <h1>
            <span className="text-neutral mb-2 block text-3xl font-bold" suppressHydrationWarning>
              {greeting}
            </span>
            <span className="text-accent block text-[1.75rem] font-bold" suppressHydrationWarning>
              {role}
            </span>
          </h1>

          <h2 className="text-neutral mt-3" suppressHydrationWarning>
            {description}
          </h2>

          <div className="mt-6 flex flex-wrap gap-6">
            <a
              href={primaryButtonUrl}
              aria-label="Connect with me"
              className="bg-accent min-w-32 cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium text-[#00071E]">
              {primaryButtonText}
            </a>
            <a
              href={secondaryButtonUrl}
              aria-label="Subscribe to Newsletter"
              className="text-neutral bg-secondary cursor-pointer rounded-lg px-[14px] py-[10px] text-sm">
              {secondaryButtonText}
            </a>
          </div>
        </div>

        <div className="flex min-h-[18.75rem] items-center justify-center lg:min-h-[35rem]">
          <div className="text-accent relative size-56 sm:size-60 md:size-[20rem] lg:size-[clamp(25.75rem,28vw,42rem)]">
            <Image
              src={imageUrl || HeroImage}
              fill={true}
              priority={true}
              sizes="(min-width: 1024px) clamp(25.75rem, 28vw, 42rem), (min-width: 768px) 20rem, (min-width: 640px) 15rem, 14rem"
              alt={greeting}
              className="object-contain p-7"
            />
            <Ellipse
              ref={ellipseRef}
              className="absolute top-0 left-0 size-56 transition-transform duration-500 ease-out sm:size-60 md:size-[20rem] lg:size-[clamp(25.75rem,28vw,42rem)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
