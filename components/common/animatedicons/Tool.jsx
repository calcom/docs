import { Puzzle, PuzzleExtruded } from "@/components/icons/puzzle"

export const Tool = ({ className }) => {
  return <div className={`${className} aspect-square relative`}>
      <Puzzle className="mix-blend-color-burn text-amber-500"/>
      <Puzzle className="absolute right-[-50%] top-[0] mix-blend-color-burn text-yellow-400 h-[100%]" />
    </div>
}
