import RatingStars from './RatingStars.jsx'

function ReviewCard({ avatarUrl, username = 'User', rating = 0, text = '' }) {
  return (
    <div className="rounded-xl bg-background-secondary border border-white/5 p-4 smooth-transition">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl ?? 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(username)}
          alt={`${username} avatar`}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <div className="text-white font-semibold text-sm">{username}</div>
          <RatingStars value={rating} readOnly size={14} />
        </div>
      </div>
      {text && <p className="text-surface-300 text-sm mt-3">{text}</p>}
    </div>
  )
}

export default ReviewCard

