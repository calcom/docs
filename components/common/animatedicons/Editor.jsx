import { Users } from "@/components/icons/users"
import { Terminal } from "@/components/icons/terminal"

export const Editor = ({ className }) => {
  return <div className={`${className} aspect-square relative`}>
      <Terminal className="mix-blend-color-burn text-amber-500"/>
      <Users className="absolute right-[-35%] top-[-36%] mix-blend-color-burn text-yellow-400 h-[80%]" />
    </div>
}
