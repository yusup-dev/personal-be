import { link } from "fs";
import path from "path";
import { title } from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal API Documentation",
      version: "1.0.0",
      description: "A simple Personal API built with Node.js, Express, and Prisma",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local development server" },
    ],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Posts", description: "Post management endpoints" },
      { name: "Comments", description: "Comment management endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Post: {
          type: "object",
          required: ["title", "content"],
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            content: { type: "string" },
            imageUrl: { type: "string" },
            authorId: { type: "integer" },
          },
        },
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        Comment: {
          type: "object",
          required: ["text", "postId"],
          properties: {
            id: { type: "integer" },
            text: { type: "string" },
            postId: { type: "integer" },
            authorId: { type: "integer" },
          },
        },
      },
    },
    paths: {
      // --- AUTH ---
      "/api/auth/signup": {
        post: {
          summary: "Register a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Bad request" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "User login",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      // --- POSTS ---
      "/api/posts": {
        get: {
          summary: "Get all posts",
          tags: ["Posts"],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "List of posts" },
          },
        },
        post: {
          summary: "Create a new post",
          tags: ["Posts"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    image: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Post created" },
          },
        },
      },
      "/api/posts/{id}": {
        get: {
          summary: "Get a single post",
          tags: ["Posts"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Post details" },
            404: { description: "Not found" },
          },
        },
        patch: {
          summary: "Update a post",
          tags: ["Posts"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    image: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Post updated" },
          },
        },
        delete: {
          summary: "Delete a post",
          tags: ["Posts"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: { description: "Post deleted" },
          },
        },
      },
      // --- PORTFOLIO ---
      "/api/portfolios": {
        post: {
          summary : "Create a portfolio",
          tags: ["Portfolio"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "link"],
                  properties: {
                    title: { type: "string" },
                    link: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Portfolio created" },
          },
        }
      },
      // --- COMMENTS ---
      "/api/comments": {
        post: {
          summary: "Create a comment",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text", "postId"],
                  properties: {
                    text: { type: "string" },
                    postId: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Comment created" },
          },
        },
      },
      "/api/comments/post/{postId}": {
        get: {
          summary: "Get comments for a post",
          tags: ["Comments"],
          parameters: [
            {
              name: "postId",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "List of comments" },
          },
        },
      },
      "/api/comments/{id}": {
        delete: {
          summary: "Delete a comment",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: { description: "Comment deleted" },
          },
        },
      },
    },
  },
  apis: [],
};
