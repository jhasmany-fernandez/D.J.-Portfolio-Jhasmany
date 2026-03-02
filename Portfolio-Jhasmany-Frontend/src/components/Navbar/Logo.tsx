import React from "react"

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 512 512"
    width="48"
    height="48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <defs>
      {/* Degradado azul */}
      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--gradient-start, #00d8ff)" />
        <stop offset="100%" stopColor="var(--gradient-mid, #009dff)" />
      </linearGradient>
    </defs>

    {/* Marco del laptop */}
    <rect x="64" y="64" width="384" height="256" rx="16" fill="url(#grad)" />
    {/* Pantalla */}
    <rect x="96" y="96" width="320" height="192" rx="8" fill="white" />

    {/* Símbolo </> centrado y proporcionado */}
    <g transform="translate(256,196) scale(0.75)">
      <g transform="translate(-60,-48)">
        <path
          d="M-40 0 L-80 64 L-40 128"
          stroke="url(#grad)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M160 0 L200 64 L160 128"
          stroke="url(#grad)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M60 -10 L80 138"
          stroke="url(#grad)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </g>

    {/* Base del laptop */}
    <rect x="48" y="320" width="416" height="56" rx="8" fill="url(#grad)" />

    {/* Touchpad */}
    <rect x="224" y="336" width="64" height="20" rx="4" fill="white" opacity="0.7" />
  </svg>
)

export default Logo
