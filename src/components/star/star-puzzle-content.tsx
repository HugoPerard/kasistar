import { PuzzleImage } from '@/components/puzzle-image'

export function StarPuzzleContent({
  imagePath,
  alt,
}: {
  imagePath: string
  alt: string
}) {
  return (
    <div className="puzzle-frame">
      <PuzzleImage
        src={imagePath}
        alt={alt}
        fetchPriority="high"
        loading="eager"
      />
    </div>
  )
}
