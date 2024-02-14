import { Bleed } from "@components/ui/bleed"

export const BorderedPanel = ({ children}) => {
  return <Bleed>
    <div className="bg-white px-4 border border-neutral-100 rounded-md">
      { children }
    </div>
  </Bleed>
}