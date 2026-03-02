'use client'

import { Project } from '@/lib/types'
import Image from 'next/image'
import { useState } from 'react'
import { Earning, GithubIcon, Likes, PreviewIcon, ShoppingCartIcon, Star, Timer } from '../../utils/icons'

const IconText: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <li className="flex gap-2 items-center">
    <Image src={icon} alt={text} className="size-[18px] md:size-5" />
    <span className="text-neutral text-sm">{text}</span>
  </li>
)

// Helper functions to format statistics with descriptive text only (icons handled by IconText)
const formatVisitors = (value: string) => `${value} Visitors`
const formatEarned = (value: string) => `${value} Earned`
const formatGithubStars = (value: string) => `${value} Stars`
const formatRatings = (value: string) => `${value} Rating`
const formatNumberOfSales = (value: string) => `${value} Sales`
const formatSiteAge = (value: string) => `${value} old`

interface ProjectCardProps {
  data: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ data }) => {
  const [isImageOpen, setIsImageOpen] = useState(false)

  const {
    title,
    shortDescription,
    visitors,
    showVisitorsInPortfolio,
    earned,
    showEarnedInPortfolio,
    ratings,
    showRatingsInPortfolio,
    githubStars,
    showGithubStarsInPortfolio,
    numberOfSales,
    showNumberOfSalesInPortfolio,
    livePreview,
    showLivePreviewInPortfolio,
    githubLink,
    showGithubInPortfolio,
    siteAge,
    showSiteAgeInPortfolio,
    type,
    cover,
  } = data

  return (
    <div className="bg-secondary border-border flex flex-col justify-between rounded-[14px] border p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
            <h3 className="text-secondary-content text-lg font-medium md:font-semibold">{title}</h3>
            {type && (
              <span
                className={`h-7 w-fit rounded-md bg-[#FFFFFF1A] p-1 text-sm ${type === 'New 🔥' ? 'animate-blink text-tag' : 'text-accent'} backdrop-blur-[80px]`}>
                {type}
              </span>
            )}
          </div>
          <ul className="mt-3 flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-4">
            {visitors && showVisitorsInPortfolio && (
              <IconText text={formatVisitors(visitors)} icon={Likes} />
            )}
            {numberOfSales && showNumberOfSalesInPortfolio && (
              <IconText text={formatNumberOfSales(numberOfSales)} icon={ShoppingCartIcon} />
            )}
            {siteAge && showSiteAgeInPortfolio && (
              <IconText text={formatSiteAge(siteAge)} icon={Timer} />
            )}
            {earned && showEarnedInPortfolio && (
              <IconText text={formatEarned(earned)} icon={Earning} />
            )}
            {ratings && showRatingsInPortfolio && (
              <IconText text={formatRatings(ratings)} icon={Star} />
            )}
            {githubStars && showGithubStarsInPortfolio && (
              <IconText text={formatGithubStars(githubStars)} icon={Star} />
            )}
          </ul>
        </div>
        {cover && (
          <figure className="flex justify-end overflow-hidden cursor-pointer" onClick={() => setIsImageOpen(true)}>
            <Image
              src={cover}
              width={150}
              height={80}
              alt="Project Cover"
              className="h-[80px] w-[150px] rounded-md object-cover shadow-[0px_1.66px_3.74px_-1.25px_#18274B1F] hover:opacity-80 transition-opacity"
            />
          </figure>
        )}
      </div>

      <div>
        <div className="bg-primary text-primary-content my-4 h-[100px] overflow-scroll rounded-2xl px-4 py-2">
          <p className="text-[14px] font-normal md:text-base">{shortDescription}</p>
        </div>
        <div className="flex gap-5">
          {livePreview && showLivePreviewInPortfolio && (
            <a
              href={livePreview}
              className="text-accent flex gap-2 text-sm underline underline-offset-[3px] transition-all duration-75 ease-linear hover:scale-105 md:text-base"
              target="_blank">
              <PreviewIcon className="h-auto w-[18px] md:w-5" />
              <span>Live Preview</span>
            </a>
          )}
          {githubLink && showGithubInPortfolio && (
            <a
              href={githubLink}
              className="text-accent flex gap-2 text-sm underline underline-offset-[3px] transition-all duration-75 ease-linear hover:scale-105 md:text-base"
              target="_blank">
              <GithubIcon className="w-[18px] md:w-5" />
              <span>Github Link</span>
            </a>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isImageOpen && cover && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <Image
              src={cover}
              width={1200}
              height={800}
              alt={title}
              className="max-h-[90vh] w-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCard
