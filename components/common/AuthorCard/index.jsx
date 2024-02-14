export const AuthorCard = ({ author }) => {
  if (!author) {
    return <></>
  }
  return <div className="flex flex-row items-center gap-3 group">
      <a className="flex-none" href={`https://twitter.com/${author.twitter}`}>
        <img className="rounded-full w-10 h-10 object-cover hover:opacity-80 transition" src={author.avatarUrl} />
      </a>
      <div className="flex flex-col flex-grow">
        <p className="text-sm text-neutral-800 font-semibold">
          {author.name}
        </p>
        <a
          href={`https://twitter.com/${author.twitter}`}
          className="plainLink font-medium text-sm"
          >
            {author.twitter}
        </a>
      </div>
    </div>
}

<AuthorCard author={{
  name: "Michael Fester",
  twitter: "michaelfester",
  avatarUrl: "https://res.cloudinary.com/djp21wtxm/image/upload/v1651630007/Me_uyndrz.jpg"
}}/>