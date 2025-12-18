'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const MarqueeWrapper = dynamic(() => import('../Marquee/MarqueeWrapper'), { ssr: false })

type SkillsProps = {
  skills: { name: string; icon: string }[]
}

// Helper function to check if string is an emoji or image path
const isEmoji = (str: string): boolean => {
  // Check if it starts with common image paths or protocols
  if (str.startsWith('/') || str.startsWith('http') || str.includes('.')) {
    return false
  }
  // Simple emoji detection (single character or contains emoji unicode ranges)
  return str.length <= 3 || /\p{Emoji}/u.test(str)
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <MarqueeWrapper className="from-primary to-primary via-marquee bg-linear-to-r">
      <div className="flex gap-8 lg:gap-24">
        {skills.map(({ name, icon }, index) => (
          <span
            key={index}
            className="font-inter text-primary-content flex items-center text-xs lg:text-base">
            {isEmoji(icon) ? (
              <span className="mx-2 text-4xl lg:text-5xl">{icon}</span>
            ) : (
              <Image
                src={icon}
                alt={name}
                width={60}
                height={60}
                className="mx-2 size-11 lg:size-14"
              />
            )}
            {name}
          </span>
        ))}
      </div>
    </MarqueeWrapper>
  )
}

export default Skills
