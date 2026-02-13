import { GraphQLClient, gql } from "graphql-request";

// WordPress GraphQL endpoint
const endpoint = process.env.WORDPRESS_GRAPHQL_URL || "";

// WordPress site URL (derived from GraphQL endpoint)
const wpSiteUrl = endpoint ? endpoint.replace(/\/graphql$/, "") : "";

// Create GraphQL client
const client = new GraphQLClient(endpoint);

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
}

export interface WPPartner {
  name: string;
  shortName: string;
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
      }
    }
  }
`;

const GET_PARTNERS = gql`
  query GetPartners {
    partners(first: 50) {
      nodes {
        title
        partnerFields {
          shortName
          logo {
            sourceUrl
            altText
          }
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
          location
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
    }[];
  };
}

interface PartnersResponse {
  partners: {
    nodes: {
      title: string;
      partnerFields: {
        shortName: string;
        logo?: {
          sourceUrl: string;
          altText: string;
        };
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
        location: string;
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
    return data.faqs.nodes.map((node) => ({
      question: node.title,
      answer: node.content.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML tags
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
      logo: node.partnerFields?.logo,
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
      location: node.eventFields?.location,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
