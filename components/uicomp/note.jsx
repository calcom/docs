import cn from "classnames"

export const getClassname = (type) => {
  switch (type) {
    case "success": return "bg-green-100 text-green-900"
    case "info": return "bg-sky-100"
    case "warning": return "bg-orange-100"
    case "error": return "bg-rose-100"
  }
}

export const Note = ({ type, children }) => {
  return <div className={cn(
        "note my-8 rounded-md p-8",
        getClassname(type)
      )}>
      {children}
    </div>
}

<Note type="warning">
asd
</Note>