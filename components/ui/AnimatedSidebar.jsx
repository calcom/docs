import { useState } from "react"
import cn from "classnames"
import config from "/project-config"
import { ChevronRight } from "@components/icons/chevronright";

export const Cursor = ({ element, fast, className }) => {
  return <div
      style={{
        opacity: !!element ? 1 : 0,
        ...(element && {
          left: element.offsetLeft - 16,
          top: element.offsetTop + 4,
          width: 2,
          height: element.clientHeight - 8
        })
      }}
      className={`z-0 absolute transition-all ${fast ? 'duration-[50ms]' : 'duration-[200ms]'} ${className || "rounded-md bg-neutral-100"}`}
    />
}

export const SidebarItem = ({ page, currentPath, selectedEl, setSelectedEl, setHoveredEl, depth, onClick }) => {
  const pageSlug = page?.href
  const isSelected = currentPath?.startsWith(pageSlug)
  return <>
    <div
      ref={(el) => {
        if (isSelected && !selectedEl && el) {
          setSelectedEl(el);
        }
      }}
    >
      <a
        href={pageSlug}
        style={{
          marginLeft: depth*16
        }}
        className={cn(
          "flex flex-row items-center gap-2 text-[18px] transition duration-200 py-1.5 outline-none",
          {
            "text-primary-500 hover:text-neutral-900": !isSelected,
            "text-primary-700 font-semibold": isSelected,
          }
        )}
        onMouseEnter={(e) => setHoveredEl(e.target)}
        onClick={(e) => {
          setSelectedEl(e.target)
          onClick?.()
        }}
      >
        <div className="flex-grow">{page?.title}</div>
        {page?.pages?.length > 0 && (
          <ChevronRight
            className={cn(
              "flex-none text-neutral-400 dark:text-white/20 dark:group-hover:text-white/80 w-5 h-5 transform transition",
              {
                "rotate-90": isSelected,
              }
            )}
          />
        )}
      </a>
    </div>
    {page?.pages?.length > 0 && (<>
      {page?.pages?.map((subPage) => {
        return <div className={!isSelected && "hidden"}>
            <SidebarItem
              page={subPage}
              currentPath={currentPath}
              selectedEl={selectedEl}
              setSelectedEl={setSelectedEl}
              setHoveredEl={setHoveredEl}
              visible={isSelected}
              depth={depth+1}
              onClick={onClick} />
          </div>
      })}
    </>)}
  </>
}

export const AnimatedSidebar = ({
    sidebarConfig,
    currentPath,
    ghostCursorClassName,
    onLinkClick }) => {
  const [hoveredEl, setHoveredEl] = useState(undefined)
  const [selectedEl, setSelectedEl] = useState(undefined)
  return <div
    className="relative flex flex-col gap-8 mt-6 md:mt-0"
    onMouseLeave={() => setHoveredEl(undefined) }>
    {sidebarConfig.map((section, si) => {
      return <div className="flex flex-col gap-0">
          <p className="text-base uppercase font-semibold text-primary-500 py-1.5">
            {section.title}
          </p>
          { (section.pages || []).map((page, ei) => {
            return <SidebarItem
                page={page}
                currentPath={currentPath}
                selectedEl={selectedEl}
                setSelectedEl={setSelectedEl}
                setHoveredEl={setHoveredEl}
                depth={0}
                onClick={onLinkClick} />
          })}
        </div>
      })}
      <Cursor element={hoveredEl} className={ghostCursorClassName} fast />
    </div>
}
