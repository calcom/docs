import { Globe } from "@components/icons/globe"
import { FastForward } from "@components/icons/fastforward"

export const Host = ({ className }) => {
  return <div className={`${className} aspect-square relative`}>
      <Globe className="mix-blend-color-burn text-amber-500"/>
      <FastForward className="absolute right-[-25%] top-[-30%] mix-blend-color-burn text-yellow-400 h-[80%]"/>
    </div>
}

<div className="p-12">
  <Host className="h-12"/>
</div>