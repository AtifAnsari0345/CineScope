function LoadingSkeleton({ className = '' }) {
  return (
    <div
      className={`bg-background-secondary/60 rounded-md border border-white/5 animate-pulse ${className}`}
    />
  )
}

export default LoadingSkeleton

