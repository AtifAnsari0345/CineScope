import { useState } from 'react'

function SearchBar({
  placeholder = 'Search movies…',
  onSubmit,
  defaultValue = '',
  value: controlledValue,
  onChange,
  onFocus,
  onBlur
}) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const isControlled = typeof controlledValue === 'string'
  const inputValue = isControlled ? controlledValue : localValue

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit?.(inputValue)
  }

  function handleChange(nextValue) {
    if (!isControlled) {
      setLocalValue(nextValue)
    }
    onChange?.(nextValue)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="search"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="smooth-transition w-full rounded-md bg-background-secondary text-white placeholder-surface-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 px-4 py-2"
      />
    </form>
  )
}

export default SearchBar
