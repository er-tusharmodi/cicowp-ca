import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPage(slug: string) {
  await dbConnect();

  const page = await Page.findOne({
    slug,
    isPublished: true,
  }).lean();

  if (!page) {
    return null;
  }

  return {
    ...page,
    _id: page._id.toString(),
    createdAt: page.createdAt?.toString(),
    updatedAt: page.updatedAt?.toString(),
  };
}

export async function generateMetadata({ params }: PageProps) {
  const page = await getPage(params.slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${page.title} | Cicowp-ca`,
    description: page.metaDescription || page.title,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-mist py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="reveal">
            {/* Page Header */}
            <header className="mb-8 pb-8 border-b border-ink/10">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
                {page.title}
              </h1>
              {page.metaDescription && (
                <p className="text-lg text-ink/70">{page.metaDescription}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-ink/50">
                <time dateTime={page.updatedAt}>
                  Last updated:{" "}
                  {new Date(page.updatedAt || "").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            {/* Page Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-display prose-headings:text-ink
                prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-ink/80 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-pine prose-a:no-underline hover:prose-a:underline
                prose-strong:text-ink prose-strong:font-semibold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-ink/80 prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-pine 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-ink/70
                prose-code:bg-ink/5 prose-code:px-1.5 prose-code:py-0.5 
                prose-code:rounded prose-code:text-sm prose-code:text-pine
                prose-pre:bg-ink/5 prose-pre:p-4 prose-pre:rounded-lg
                prose-img:rounded-lg prose-img:shadow-soft"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
