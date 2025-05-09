import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";

import { fetchPost } from "./data";
import { Post } from "./post";
import { RelatedPosts } from "./related-posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: "Mint Cashback | Post Not Found",
      description: "The requested blog post could not be found",
    };
  }

  const content = (post.content as Record<string, unknown>) || {};
  const excerpt = (content.excerpt as string) || "Read this blog post";
  const imageUrl = (content.imageUrl as string) || null;
  const author = (content.author as string) || "Mint Team";

  return {
    title: `Mint Cashback | ${post.title}`,
    description: excerpt,

    openGraph: {
      type: "article",
      title: post.title,
      description: excerpt,
      images: imageUrl ? [imageUrl] : [],
    },

    alternates: {
      canonical: `https://mintcashback.com/blog/${post.slug}`,
    },

    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: excerpt,
        image: imageUrl,
        url: `https://mintcashback.com/blog/${post.slug}`,
        datePublished: post.published_at,
        author: {
          "@type": "Person",
          name: author,
        },
      }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col min-h-screen gap-12 px-6 py-6 mx-auto sm:flex-row max-w-7xl">
      <div className="w-full sm:w-4/5">
        <BlurFade>
          <Link href="/blog" passHref>
            <Button variant="outline" className="mb-4">
              <ArrowLeftIcon />
              Back to Blog
            </Button>
          </Link>
        </BlurFade>

        <Suspense fallback={undefined}>
          <Post slug={slug} />
        </Suspense>
      </div>

      <div className="w-full sm:w-1/5">
        <TextAnimate
          animation="slideUp"
          by="character"
          className="text-2xl font-bold"
          delay={0.25}
          startOnView={false}
        >
          Related Posts
        </TextAnimate>

        <Suspense fallback={undefined}>
          <RelatedPosts slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
