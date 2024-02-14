import cn from "classnames";
import type { FC, ReactNode, SyntheticEvent } from "react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog as HUIDialog, Transition } from "@headlessui/react@1.7.8";
import ChatIcon from "@components/icons/chat";
import { Close } from "@components/icons/close";
import { IconButton } from "@components/ui/iconbutton";

const API_URL =
  "https://cal-docs.motif.land/api/motif/v1/integrations/gptsearch/completions";
const I_DONT_KNOW = "Sorry, I am not sure how to answer that.";

type DialogProps = {
  isOpen: Boolean;
  onClose: () => void;
  children: ReactNode;
};

const Dialog: FC<DialogProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <HUIDialog open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-50 fixed inset-0 bg-black/20 backdrop-blur-md" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="z-50 fixed inset-y-8 sm:inset-y-0 inset-x-8 sm:inset-x-0 flex items-center justify-center">
            <HUIDialog.Panel className="relative w-full bg-white dark:bg-neutral-900 rounded-lg max-w-screen-sm">
              {children}
            </HUIDialog.Panel>
          </div>
        </Transition.Child>
      </HUIDialog>
    </Transition>
  );
};

const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <span className="loading-dots">
      <span className={className} />
      <span className={className} />
      <span className={className} />
    </span>
  );
};

type AnswerProps = {
  answer: string;
  onLinkClick: () => void;
};

const Answer: FC<AnswerProps> = ({ answer, onLinkClick }) => {
  const [plugins, setPlugins] = useState<any>([]);
  const [ReactMarkdownComp, setReactMarkdownComp] = useState<any>(undefined);

  useEffect(() => {
    import("https://esm.sh/remark-gfm@3.0.1")
      .then((mod) => mod.default)
      .then((gfm) => {
        setPlugins([gfm]);
      });
  }, []);

  useEffect(() => {
    if (!plugins) {
      return;
    }
    import("https://esm.sh/react-markdown@8.0.5")
      .then((mod) => mod.default)
      .then((RM) => {
        setReactMarkdownComp(
          <RM
            remarkPlugins={plugins}
            components={{
              a: (props: any) => {
                return <a {...props} onClick={onLinkClick} />;
              },
              li: ({ children, ...props }: any) => {
                return (
                  <li {...props} className="not-prose">
                    {children}
                  </li>
                );
              },
              ul: (props: any) => {
                return <ul {...props} className="not-prose" />;
              },
            }}
          >
            {answer}
          </RM>
        );
      });
  }, [answer, plugins]);

  return (
    <div className="flex flex-col gap-4">
      <div className="prose dark:prose-invert">{ReactMarkdownComp}</div>
    </div>
  );
};

type PathMeta = {
  path: string;
  meta?: { title: string } & { [key: string]: any };
};

type ReferenceInfo = {
  path: string;
  title: string;
};

type IdPathMetaMap = { [key: string]: PathMeta };

type ReferencesProps = {
  references: string[];
  idPathMetaMap: IdPathMetaMap;
  onLinkClick: () => void;
};

const References: FC<ReferencesProps> = ({
  references,
  idPathMetaMap,
  onLinkClick,
}) => {
  const referenceInfo = useMemo(() => {
    return (references || [])
      .slice(0, 5)
      .map((id) => {
        const pathMeta = idPathMetaMap?.[id];
        if (!pathMeta) {
          return undefined;
        }
        const title = pathMeta.meta?.title || "Untitled";
        const path = pathMeta.path ?? "/";
        return { path, title };
      })
      .filter(Boolean) as ReferenceInfo[];
  }, [references]);

  return (
    <>
      {referenceInfo.length > 0 && (
        <div>
          <p className="font-medium mb-1">References</p>
          {referenceInfo.map(({ path, title }) => {
            return (
              <a
                className="block subtleUnderline text-sm text-neutral-500 dark:text-white/50"
                href={path}
                onClick={onLinkClick}
              >
                {title}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
};

type DialogContentProps = {
  idPathMetaMap: IdPathMetaMap;
  onLinkClick: () => void;
  onClose: () => void;
  placeholder?: string;
  iDontKnowMessage?: string;
};

const DialogContent: FC<DialogContentProps> = ({
  idPathMetaMap,
  onLinkClick,
  onClose,
  placeholder,
  iDontKnowMessage: _iDontKnowMessage,
}) => {
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [answer, setAnswer] = useState("");
  const [references, setReferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const answerContainerRef = useRef<HTMLDivElement>(null);
  const iDontKnowMessage = _iDontKnowMessage || I_DONT_KNOW;

  const submitPrompt = useCallback(
    async (e: SyntheticEvent<EventTarget>) => {
      e.preventDefault();

      if (!prompt) {
        return;
      }

      setAnswer("");
      setReferences([]);
      setLoading(true);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, iDontKnowMessage }),
        });

        if (!res.ok || !res.body) {
          // Don't show the verbatim error message to users, but print
          // it in the console.
          console.warn(await res.text());
          setAnswer(iDontKnowMessage);
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let startText = "";
        let didHandleHeader = false;
        let __references = [];

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          if (!didHandleHeader) {
            startText = startText + chunkValue;
            if (startText.includes("___MOTIF_START_STREAM___")) {
              const parts = startText.split("___MOTIF_START_STREAM___");
              try {
                __references = JSON.parse(parts[0]);
              } catch {}
              setAnswer((prev) => prev + parts[1]);
              didHandleHeader = true;
            }
          } else {
            setAnswer((prev) => prev + chunkValue);
          }
        }
        setReferences(__references);
      } catch {
        setAnswer(iDontKnowMessage);
      }
      setLoading(false);
    },
    [prompt]
  );

  useEffect(() => {
    answerContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer, references]);

  return (
    <div className="absolute px-5 py-4 flex flex-col inset-0">
      <div className="flex-none w-full">
        <form onSubmit={submitPrompt}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              {loading ? (
                <LoadingDots className="bg-neutral-500 dark:bg-white/50" />
              ) : (
                <ChatIcon className="w-5 h-5 text-neutral-500 dark:text-white/30" />
              )}
            </div>
            <input
              value={prompt || ""}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder || "Ask a question..."}
              className="w-full block py-2 pl-11 pr-16 text-sm text-neutral-900 dark:text-white/80 placeholder:text-neutral-400 dark:placeholder:text-white/50 focus:outline-none sm:text-sm transition bg-transparent"
              type="text"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <div className="hidden sm:block text-xs text-neutral-400 dark:text-white/20 border border-neutral-200 dark:border-white/10 rounded px-2 bg-neutral-50 dark:bg-white/10">
                Esc
              </div>
            </div>
          </div>
        </form>
        <IconButton
          Icon={Close}
          className="absolute top-[22px] right-4 items-center sm:hidden"
          onClick={onClose}
          ariaLabel="Close menu"
        />
      </div>
      <div className="flex-grow mt-2 py-6 h-full overflow-y-auto border-t border-neutral-100 dark:border-white/5">
        <Answer answer={answer} onLinkClick={onLinkClick} />
        <div
          className={cn("mt-8 transition duration-500", {
            "opacity-0": !references || references?.length === 0,
          })}
        >
          <References
            references={references}
            idPathMetaMap={idPathMetaMap}
            onLinkClick={onLinkClick}
          />
        </div>
        <div className="h-24 w-full" />
        <div ref={answerContainerRef} />
      </div>
      <p className="pt-4 pb-1 border-t border-neutral-100 dark:border-white/10 text-xs text-neutral-400 dark:text-white/20">
        Powered by{" "}
        <a
          className="underline"
          href="https://motif.land"
          target="_blank"
          rel="noreferrer"
        >
          Motif
        </a>{" "}
        and{" "}
        <a
          className="underline"
          href="https://openai.com"
          target="_blank"
          rel="noreferrer"
        >
          OpenAI
        </a>
      </p>
    </div>
  );
};

type FileTree = {
  files: FileTree[];
  folders: FileTree[];
  id: string;
  path: string;
  meta: { [key: string]: any };
};

const toIdPathMetaMap = (tree: any) => {
  let saveMap: any = {};

  const updateMap = (tree: FileTree) => {
    for (const file of tree.files) {
      saveMap[file.id] = { path: file.path, meta: file.meta } || {};
    }
    for (const folder of tree.folders) {
      updateMap(folder);
    }
  };

  updateMap(tree);

  return saveMap;
};

type PromptProps = {
  files: FileTree;
  placeholder?: string;
  iDontKnowMessage?: string;
  Icon?: ReactNode;
};

export const Prompt: FC<PromptProps> = ({
  files,
  placeholder,
  iDontKnowMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const idPathMetaMap = useMemo(() => {
    return files ? toIdPathMetaMap(files) : {};
  }, [files]);

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="fixed right-5 bottom-5 w-min p-1 group hover:opacity-90 transition rounded cursor-pointer z-50"
      >
        <ChatIcon className="w-10 h-10 p-2 bg-neutral-900 rounded-full text-white transition" />
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="max-w-screen-sm mx-auto h-[calc(100vh-120px)] max-h-[720px] overflow-hidden">
          <DialogContent
            idPathMetaMap={idPathMetaMap}
            onLinkClick={() => setIsOpen(false)}
            onClose={() => setIsOpen(false)}
            placeholder={placeholder}
            iDontKnowMessage={iDontKnowMessage}
          />
        </div>
      </Dialog>
    </>
  );
};
