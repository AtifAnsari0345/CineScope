import { useState } from 'react'

function Star({ filled, size = 18 }) {
  const fill = filled ? 'currentColor' : 'none'
  const stroke = 'currentColor'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="smooth-transition"
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  )
}

function RatingStars({ value = 0, max = 5, onChange, size = 18, readOnly = false, className = '' }) {
  const [hovered, setHovered] = useState(null)
  const displayValue = hovered ?? value

  function handleClick(i) {
    if (readOnly) return
    onChange?.(i + 1)
  }

  return (
    <div className={`flex items-center gap-1 text-yellow-400 overflow-visible ${className}`} role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }).map((_, i) => {
        const isFilled = i < displayValue
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i + 1 === value}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHovered(i + 1)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            onClick={() => handleClick(i)}
            className={`p-0.5 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            title={`${i + 1} star${i ? 's' : ''}`}
          >
            <Star filled={isFilled} size={size} />
          </button>
        )
      })}
    </div>
  )
}

export default RatingStars

