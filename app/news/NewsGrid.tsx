"use client";

import { useState } from "react";
import { WPPost } from "../lib/wordpress";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function truncateText(text: string, maxLength: number): string {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + "...";
}

function NewsCard({
  post,
  isExpanded,
  onToggle,
}: {
  post: WPPost;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
        isExpanded ? "shadow-lg ring-2 ring-coral/20" : "hover:shadow-md"
      }`}
    >
      {post.featuredImage && (
        <div className="aspect-video bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!post.featuredImage && (
        <div className="aspect-video bg-cream flex items-center justify-center">
          <span className="text-navy/30 text-sm">No image</span>
        </div>
      )}
      <div className="p-6">
        <time className="text-sm text-navy/50 uppercase tracking-wide">
          {formatDate(post.date)}
        </time>
        <h2 className="mt-2 text-xl font-spectral font-bold text-navy">
          {post.title}
        </h2>

        {/* Collapsed view - show excerpt */}
        {!isExpanded && (
          <>
            <p className="mt-3 text-navy/70 line-clamp-3">
              {truncateText(post.excerpt, 150)}
            </p>
            <button
              onClick={onToggle}
              className="mt-4 inline-flex items-center text-coral hover:text-coral-dark font-medium transition-colors"
              aria-expanded={false}
              aria-label={`Read more about ${post.title}`}
            >
              Read more
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Expanded view - show full content */}
        {isExpanded && (
          <>
            <div
              className="mt-4 prose prose-navy prose-sm max-w-none
                prose-p:text-navy/80 prose-p:leading-relaxed
                prose-headings:text-navy prose-headings:font-spectral
                prose-a:text-coral prose-a:no-underline hover:prose-a:underline
                prose-strong:text-navy prose-strong:font-semibold
                prose-ul:text-navy/80 prose-ol:text-navy/80
                prose-li:marker:text-coral"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <button
              onClick={onToggle}
              className="mt-6 inline-flex items-center text-coral hover:text-coral-dark font-medium transition-colors"
              aria-expanded={true}
              aria-label={`Show less about ${post.title}`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Show less
            </button>
          </>
        )}
      </div>
    </article>
  );
}

interface NewsGridProps {
  posts: WPPost[];
}

export default function NewsGrid({ posts }: NewsGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-navy/50 text-lg">
          No news articles available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <NewsCard
          key={post.id}
          post={post}
          isExpanded={expandedId === post.id}
          onToggle={() => toggleExpand(post.id)}
        />
      ))}
    </div>
  );
}
