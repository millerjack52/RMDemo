function clsx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function MissionHero({ eyebrow, title, highlight, body, bullets, image }: any) {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        {eyebrow && (
          <div className="text-orange-600 font-semibold text-sm mb-3">
            {eyebrow}
          </div>
        )}
        <h2 className="text-4xl font-semibold leading-tight mb-3">
          {title}, <span className="text-orange-600">{highlight}</span>
        </h2>
        <p className="text-gray-600 max-w-prose mb-6">{body}</p>
        <div className="space-y-4">
          {bullets?.map((b: any, i: number) => (
            <div key={i}>
              <div className="font-semibold text-gray-900">{b.title}</div>
              <div className="text-gray-600 text-sm">{b.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <img
          src={image.src}
          alt={image.alt || ""}
          className="w-full object-cover shadow"
        />
        <div className="absolute -top-6 left-10 w-28 h-28 bg-orange-600/40" />
        <div className="absolute -bottom-6 right-6 w-16 h-16 bg-gray-400/30" />
      </div>
    </section>
  );
}

function PeopleGrid({ eyebrow, title, highlight, subtitle, people }: any) {
  return (
    <section>
      <div className="text-center max-w-3xl mx-auto mb-8">
        {eyebrow && (
          <div className="text-orange-600 font-semibold text-sm mb-2">
            {eyebrow}
          </div>
        )}
        <h2 className="text-3xl font-semibold">
          {title} <span className="text-orange-600">{highlight}</span>
        </h2>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {people.map((p: any, i: number) => (
          <div
            key={i}
            className="relative border border-orange-300 bg-white shadow-sm hover:shadow transition p-4 transform hover:scale-105 duration-300 ease-in-out"
          >
            <div className="relative overflow-hidden aspect-[4/5] mb-4">
              <img
                src={p.photo}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-600/40" />
              <div className="absolute top-3 right-3 w-16 h-16 bg-orange-600/30" />
              <div className="absolute top-3 left-3 w-10 h-10 bg-gray-300/50" />
              <div className="absolute bottom-3 right-3 w-10 h-10 bg-gray-300/50" />
            </div>
            <div className="text-center">
              <div className="text-2xl">{p.name}</div>
              <div className="text-orange-600 font-semibold text-xs tracking-wide mt-1">
                {p.role}
              </div>
              <p className="text-gray-600 text-sm mt-3">{p.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PromoRow({ items }: any) {
  return (
    <section>
      <div className="text-center mb-6">
        <p className="text-gray-700">
          Find out what makes us{" "}
          <span className="text-orange-600">different</span>.
        </p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="group relative overflow-hidden h-64 shadow transform transition duration-300 ease-in-out hover:scale-105"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover grayscale transition duration-300 group-hover:grayscale-0 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 transition-opacity duration-300 group-hover:from-black/80 group-hover:via-black/50 group-hover:to-black/30" />
            <div className="pointer-events-none absolute inset-0 bg-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative h-full p-6 flex flex-col justify-end text-white">
              <h3
                className={clsx(
                  "font-semibold transition-colors duration-300 group-hover:text-orange-500",
                  i === 0 ? "text-3xl" : "text-2xl"
                )}
              >
                {item.title}
              </h3>
              <p className="text-white/80 text-sm mt-2 max-w-sm">{item.desc}</p>
              <div className="mt-2 text-orange-400 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                See more &gt;&gt;
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function InfoBoxes() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-6xl mx-auto space-y-16">
      <MissionHero
        eyebrow="OUR MISSION"
        title="Protecting Every Worker"
        highlight="Every Day"
        body="A paragraph about road material's mission, goals, etc. Would be good to have a couple of lines so just talk a bit about how good it all is."
        bullets={[
          {
            title: "Safety Without Compromise",
            text: "We believe every worker deserves the highest level of protection, regardless of their industry or role.",
          },
          {
            title: "Sustainable Future",
            text: "Protecting workers while protecting our environment through sustainable manufacturing and materials.",
          },
          {
            title: "Innovation Leadership",
            text: "Continuously pushing boundaries to develop smarter, safer, and more comfortable protective solutions.",
          },
        ]}
        image={{
          src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
          alt: "Construction workers",
        }}
      />

      <PeopleGrid
        eyebrow="OUR PEOPLE"
        title="The Heart of"
        highlight="Road Materials"
        subtitle="Behind every safety solution is a dedicated team of experts who understand that protecting workers isn't just our business — it's our passion."
        people={[
          {
            name: "John Doe",
            role: "MANAGING DIRECTOR",
            blurb:
              "A short blurb about John lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem.",
            photo:
              "https://images.unsplash.com/photo-1573496529574-be85d6a60704?q=80&w=1200&auto=format&fit=crop",
          },
          {
            name: "Jane Smith",
            role: "OPERATIONS LEAD",
            blurb:
              "Passionate about building safe, efficient teams across facilities.",
            photo:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
          },
          {
            name: "Alex Johnson",
            role: "R&D ENGINEER",
            blurb:
              "Innovates on materials and comfort with a sustainability focus.",
            photo:
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop",
          },
          {
            name: "Priya Patel",
            role: "SAFETY TRAINER",
            blurb: "Helps partners adopt best-in-class protection practices.",
            photo:
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
          },
        ]}
      />

      <PromoRow
        items={[
          {
            title: "What we do",
            desc: "Find out what we offer, from our comprehensive range of work wear to our custom branding services.",
            image:
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
          },
          {
            title: "How we do it",
            desc: "Discover our proven process for delivering the highest quality products in the industry.",
            image:
              "https://images.unsplash.com/photo-1486304873000-235643847519?q=80&w=1600&auto=format&fit=crop",
          },
          {
            title: "Why Us?",
            desc: "Find out about our values, sustainability commitments, and what sets us apart.",
            image:
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
          },
          {
            title: "Find an Agent",
            desc: "Find a local partner who understands your needs and will get specs right.",
            image:
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
          },
        ]}
      />
    </div>
  );
}
