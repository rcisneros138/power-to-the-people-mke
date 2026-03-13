import { GraphQLClient, gql } from "graphql-request";

// WordPress GraphQL endpoint
const endpoint = process.env.WORDPRESS_GRAPHQL_URL || "";

// WordPress site URL (derived from GraphQL endpoint)
const wpSiteUrl = endpoint ? endpoint.replace(/\/graphql$/, "") : "";

// Create GraphQL client
const client = new GraphQLClient(endpoint);

// Decode HTML entities (&#8220; → ", &amp; → &, etc.)
const htmlEntities: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
  "&#039;": "'", "&apos;": "'", "&ndash;": "–", "&mdash;": "—",
  "&lsquo;": "\u2018", "&rsquo;": "\u2019",
  "&ldquo;": "\u201C", "&rdquo;": "\u201D",
  "&nbsp;": " ", "&hellip;": "…",
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&[a-zA-Z]+;/g, (entity) => htmlEntities[entity] ?? entity);
}

// Helper to get WordPress post URL
export function getPostUrl(slug: string): string {
  return wpSiteUrl ? `${wpSiteUrl}/${slug}` : "#";
}

// TypeScript types for WordPress data

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

export interface WPPage {
  id: string;
  slug: string;
  title: string;
  content: string;
}

export interface WPFAQItem {
  question: string;
  answer: string;
  order?: number;
}

export interface WPPartner {
  name: string;
  shortName: string;
  websiteUrl?: string;
  order?: number;
  logo?: {
    sourceUrl: string;
    altText: string;
  };
}

export interface WPEvent {
  id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  location?: string;
  eventDate?: string;
  eventTime?: string;
  eventUrl?: string;
}

// GraphQL Queries

const GET_POSTS = gql`
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        slug
        title
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

const GET_ALL_POST_SLUGS = gql`
  query GetAllPostSlugs {
    posts(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      slug
      title
      content
    }
  }
`;

const GET_FAQS = gql`
  query GetFAQs {
    faqs(first: 50) {
      nodes {
        title
        content
        faqOrder
      }
    }
  }
`;

const GET_PARTNERS = gql`
  query GetPartners {
    partners(first: 50) {
      nodes {
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        partnerFields {
          shortName
          websiteUrl
          order
        }
      }
    }
  }
`;

const GET_EVENTS = gql`
  query GetEvents($first: Int = 10) {
    events(first: $first) {
      nodes {
        id
        slug
        title
        content
        date
        eventFields {
          eventDate
          eventTime
          location
          eventUrl
        }
      }
    }
  }
`;

// Query Functions

interface PostsResponse {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: WPPost[];
  };
}

interface PostResponse {
  post: WPPost | null;
}

interface PostSlugsResponse {
  posts: {
    nodes: { slug: string }[];
  };
}

interface PageResponse {
  page: WPPage | null;
}

interface FAQsResponse {
  faqs: {
    nodes: {
      title: string;
      content: string;
      faqOrder: number;
    }[];
  };
}

interface PartnersResponse {
  partners: {
    nodes: {
      title: string;
      featuredImage?: {
        node: {
          sourceUrl: string;
          altText: string;
        };
      };
      partnerFields: {
        shortName: string;
        websiteUrl: string;
        order: number;
      };
    }[];
  };
}

interface EventsResponse {
  events: {
    nodes: {
      id: string;
      slug: string;
      title: string;
      content: string;
      date: string;
      eventFields: {
        eventDate: string;
        eventTime: string;
        location: string;
        eventUrl: string;
      };
    }[];
  };
}

export async function getPosts(first = 10, after?: string): Promise<{
  posts: WPPost[];
  pageInfo: { hasNextPage: boolean; endCursor: string };
}> {
  if (!endpoint) {
    return { posts: [], pageInfo: { hasNextPage: false, endCursor: "" } };
  }

  try {
    const data = await client.request<PostsResponse>(GET_POSTS, { first, after });
    return {
      posts: data.posts.nodes,
      pageInfo: data.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], pageInfo: { hasNextPage: false, endCursor: "" } };
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!endpoint) {
    return null;
  }

  try {
    const data = await client.request<PostResponse>(GET_POST_BY_SLUG, { slug });
    return data.post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  if (!endpoint) {
    return [];
  }

  try {
    const data = await client.request<PostSlugsResponse>(GET_ALL_POST_SLUGS);
    return data.posts.nodes.map((node) => node.slug);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

export async function getPage(slug: string): Promise<WPPage | null> {
  if (!endpoint) {
    return null;
  }

  try {
    const data = await client.request<PageResponse>(GET_PAGE_BY_SLUG, { slug });
    return data.page;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function getFAQs(): Promise<WPFAQItem[]> {
  if (!endpoint) {
    return [];
  }

  try {
    const data = await client.request<FAQsResponse>(GET_FAQS);
    return data.faqs.nodes
      .sort((a, b) => (a.faqOrder ?? 0) - (b.faqOrder ?? 0))
      .map((node) => ({
        question: node.title,
        answer: decodeHtmlEntities(node.content.replace(/<\/?[^>]+(>|$)/g, "")).trim(),
        order: node.faqOrder ?? 0,
      }));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getPartners(): Promise<WPPartner[]> {
  if (!endpoint) {
    return [];
  }

  try {
    const data = await client.request<PartnersResponse>(GET_PARTNERS);
    return data.partners.nodes.map((node) => ({
      name: node.title,
      shortName: node.partnerFields?.shortName || node.title,
      websiteUrl: node.partnerFields?.websiteUrl,
      order: node.partnerFields?.order ?? 0,
      logo: node.featuredImage?.node,
    }));
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

export async function getEvents(first = 10): Promise<WPEvent[]> {
  if (!endpoint) {
    return [];
  }

  try {
    const data = await client.request<EventsResponse>(GET_EVENTS, { first });
    return data.events.nodes.map((node) => ({
      id: node.id,
      slug: node.slug,
      title: node.title,
      content: node.content,
      date: node.date,
      eventDate: node.eventFields?.eventDate,
      eventTime: node.eventFields?.eventTime,
      location: node.eventFields?.location,
      eventUrl: node.eventFields?.eventUrl,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
