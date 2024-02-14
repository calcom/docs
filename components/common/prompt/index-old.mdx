import cn from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Chat from "@components/icons/chat"
import { Dialog } from "@components/ui/dialog"

export const API_URL = "/api/motif/v1/integrations/gptsearch/completions";

export const LoadingDots = ({ className }) => {
  return (
    <span className="loading-dots">
      <span className={className} />
      <span className={className} />
      <span className={className} />
    </span>
  )
}

export const Answer = ({ answer }) => {
  const [plugins, setPlugins] = useState(undefined)
  const [ReactMarkdownComp, setReactMarkdownComp] = useState(undefined)

  useEffect(() => {
    import('https://esm.sh/remark-gfm@3.0.1')
      .then((mod) => mod.default)
      .then(gfm => {
        setPlugins([gfm])
      })
  }, [])

  useEffect(() => {
    if (!plugins) {
      return
    }
    import('https://esm.sh/react-markdown@8.0.5')
      .then((mod) => mod.default)
      .then(RM => {
        setReactMarkdownComp(<RM remarkPlugins={plugins}>{answer}</RM>)
      })
  }, [answer, plugins])

  return <div className="flex flex-col gap-4">
      <div className="prose">
        {ReactMarkdownComp}
      </div>
    </div>
}

export const References = ({ references, idPathMetaMap }) => {
  const referenceInfo = useMemo(() => {
    return (references || []).slice(0, 5).map((id) => {
      const pathMeta = idPathMetaMap?.[id]
      if (!pathMeta) {
        return undefined
      }
      const title = pathMeta.meta?.title
      if (!title) {
        return undefined
      }
      const path = pathMeta.path ? pathMeta.path : "/"
      return { path, title }
    }).filter(Boolean)
  }, [references])

  return <>
      {referenceInfo.length > 0 &&
        <div>
          <p className="font-medium text-xs mb-1">References</p>
          {referenceInfo.map(({ path, title }) => {
            return <a className="block subtleUnderline text-xs text-neutral-500" href={path}>{title}</a>
          })}
        </div>
      }
    </>
}

export const DialogContent = ({ idPathMetaMap }) => {
  const [prompt, setPrompt] = useState(undefined)
  const [answer, setAnswer] = useState("")
  const [references, setReferences] = useState([])
  const [loading, setLoading] = useState(false)
  const answerContainerRef = useRef()

  const submitPrompt = useCallback(
    async (e) => {
      e.preventDefault()
      setAnswer("")
      setReferences([])
      setLoading(true)

      try {
        const res = await fetch(apiUrl+"?prompt="+encodeURIComponent(prompt), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        })
  
        if (!res.ok) {
          const r = await res.json()
          setAnswer("An error occurred. Please try again.")
        }        

        const data = res.body
        if (!data) {
          setAnswer("No data was returned. Please try again.")
          return
        }

        const reader = data.getReader()
        const decoder = new TextDecoder()
        let done = false
        let startText = ""
        let didHandleHeader = false
        let __references = []

        while (!done) {
          const { value, done: doneReading } = await reader.read()
          done = doneReading
          const chunkValue = decoder.decode(value)
          if (!didHandleHeader) {
            startText = startText + chunkValue
            if (startText.includes('___MOTIF_START_STREAM___')) {
              const parts = startText.split('___MOTIF_START_STREAM___')
              try {
                __references = JSON.parse(parts[0])
              } catch {}
              setAnswer((prev) => prev + parts[1])
              didHandleHeader = true
            }
          } else {
            setAnswer((prev) => prev + chunkValue)
          }
        }
        setReferences(__references)
      } catch {
      }
      setLoading(false)
    },
    [prompt]
  )

  useEffect(() => {
    answerContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [answer])

  return <div className="absolute px-5 py-4 flex flex-col inset-0">
        <div className="flex-none w-full">
          <form onSubmit={submitPrompt}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                {loading ?
                  <LoadingDots className="bg-neutral-500" /> :
                  <Chat className="w-5 h-5 text-neutral-900" />
                }
              </div>
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask Cal.com docs..."
                className="w-full block py-2 pl-11 pr-16 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none sm:text-sm transition"
                type="text"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <div className="text-xs text-neutral-400 border border-neutral-100 rounded px-2 py-1 bg-neutral-50">Esc</div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex-grow mt-2 py-6 h-full overflow-y-auto border-t border-neutral-100">
          <Answer answer={answer} />
          <div className={cn(
              "mt-8 transition duration-500", {
                "opacity-0": !references || references?.length === 0
              })}>
            <References
              references={references}
              idPathMetaMap={idPathMetaMap} />
          </div>
          <div className="h-24 w-full"/>
          <div ref={answerContainerRef} />
        </div>
        <p className="pt-4 pb-1 border-t border-neutral-100 text-xs text-neutral-400">Powered by <a className="underline" href="https://motif.land" target="_blank" rel="noreferrer">Motif</a> and <a className="underline" href="https://openai.com" target="_blank" rel="noreferrer">OpenAI</a></p>
      </div>
}

export const Prompt = ({ idPathMetaMap }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return <>
      <div
        onClick={() => setIsOpen(true)}
        className="fixed right-5 bottom-5 w-min p-1 group hover:opacity-90 transition rounded cursor-pointer z-50">
        <Chat className="w-10 h-10 p-2 bg-neutral-900 rounded-full text-white transition" />
      </div>
      <Dialog
        isOpen={isOpen}
        position="center"
        hideClose
        size="xs"
        onClose={() => setIsOpen(false)}>
        <div className="max-w-screen-sm mx-auto h-[calc(100vh-200px)] max-h-[600px] overflow-hidden">
          <DialogContent idPathMetaMap={idPathMetaMap} />
        </div>
      </Dialog>
    </>
}

<Prompt />