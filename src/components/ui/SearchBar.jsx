import { useState } from 'react'

function SearchBar({ placeholder = 'Search movies…', onSubmit, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="smooth-transition w-full rounded-md bg-background-secondary text-white placeholder-surface-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 px-4 py-2"
      />
    </form>
  )
}

export default SearchBar

