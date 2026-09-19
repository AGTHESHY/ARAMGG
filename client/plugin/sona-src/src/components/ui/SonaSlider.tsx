import '@/styles/SonaSlider.css'

export interface SonaSliderProps {
  value: number
  min: number
  max: number
  step?: number
  label?: string
  unit?: string
  onChange: (value: number) => void
}

export function SonaSlider({
  value,
  min,
  max,
  step = 1,
  label,
  unit = '',
  onChange,
}: SonaSliderProps) {
  return (
    <label className="sona-slider">
      {label && <span className="sona-slider-label">{label}</span>}
      <input
        className="sona-slider-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="sona-slider-value">{value}{unit}</span>
    </label>
  )
}
