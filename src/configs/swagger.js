import { link } from "fs";
import { get } from "http";
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
      description:
        "A simple Personal API built with Node.js, Express, and Prisma",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local development server" },
    ],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Posts", description: "Post management endpoints" },
      { name: "Portfolio", description: "Portfolio management endpoints" },
      { name: "Experience", description: "Experience management endpoints" },
      { name: "Skills", description: "Skill management endpoints" },
      { name: "Education", description: "Education management endpoints" },
      { name: "About", description: "About profile endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      // --- AUTH ---
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
      "/api/posts/{id}/image": {
  get: {
    summary: "Get post image",
    tags: ["Posts"],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
      },
    ],
    responses: {
      200: {
        description: "Post image",
        content: {
          "image/jpeg": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
          "image/png": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
      404: {
        description: "Image not found",
      },
    },
  },
},
      // --- PORTFOLIO ---
      "/api/portfolios": {
        get: {
          summary: "Get all portfolios",
          tags: ["Portfolio"],
          responses: {
            200: { description: "List of portfolios" },
          },
        },

        post: {
          summary: "Create portfolio",
          tags: ["Portfolio"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    github: { type: "string" },
                    article: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Portfolio created" },
          },
        },
      },

      "/api/portfolios/{id}": {
        patch: {
          summary: "Update portfolio",
          tags: ["Portfolio"],
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
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    github: { type: "string" },
                    article: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Portfolio updated" },
          },
        },

        delete: {
          summary: "Delete portfolio",
          tags: ["Portfolio"],
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
            200: { description: "Portfolio deleted" },
          },
        },
      },
      // SKILL
      "/api/skills": {
        get: {
          summary: "Get all skills",
          tags: ["Skills"],
          responses: {
            200: { description: "List of skills" },
          },
        },
        post: {
          summary: "Create skill",
          tags: ["Skills"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Skill created" },
          },
        },
      },

      "/api/skills/{id}": {
        patch: {
          summary: "Update skill",
          tags: ["Skills"],
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
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    category: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Skill updated" },
          },
        },

        delete: {
          summary: "Delete skill",
          tags: ["Skills"],
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
            200: { description: "Skill deleted" },
          },
        },
      },
      // EXPERIENCE
      "/api/experiences": {
        get: {
          summary: "Get all experiences",
          tags: ["Experience"],
          responses: {
            200: { description: "List of experiences" },
          },
        },
        post: {
          summary: "Create experience",
          tags: ["Experience"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    position: { type: "string" },
                    company: { type: "string" },
                    location: { type: "string" },
                    description: { type: "string" },
                    startDate: { type: "string", format: "date" },
                    endDate: { type: "string", format: "date" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Experience created" },
          },
        },
      },

      "/api/experiences/{id}": {
        patch: {
          summary: "Update experience",
          tags: ["Experience"],
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
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    position: { type: "string" },
                    company: { type: "string" },
                    location: { type: "string" },
                    description: { type: "string" },
                    startDate: { type: "string", format: "date" },
                    endDate: { type: "string", format: "date" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Experience updated" },
          },
        },

        delete: {
          summary: "Delete experience",
          tags: ["Experience"],
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
            200: { description: "Experience deleted" },
          },
        },
      },
      // ABOUT
      "/api/about/{id}": {
        patch: {
          summary: "Update about profile",
          tags: ["About"],
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
                    shortDescription: { type: "string" },
                    description: { type: "string" },
                    contactLink: { type: "string" },
                    pdf: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "About updated" },
          },
        },
        get: {
          summary: "Get about by id",
          tags: ["About"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "About detail" },
          },
        },
      },
      "/api/about/{id}/download": {
        get: {
          summary: "Download resume PDF",
          tags: ["About"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
              description: "About ID",
            },
          ],
          responses: {
            200: {
              description: "Resume PDF downloaded",
              content: {
                "application/pdf": {
                  schema: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
            404: {
              description: "Resume not found",
            },
          },
        },
      },
      // Education
      "/api/educations": {
        get: {
          summary: "Get all education records",
          tags: ["Education"],
          responses: {
            200: {
              description: "List of education",
            },
          },
        },

        post: {
          summary: "Create education",
          tags: ["Education"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    degree: {
                      type: "string",
                      example: "Bachelor of Computer Science",
                    },
                    school: {
                      type: "string",
                      example: "Ibn Khaldun University",
                    },
                    location: {
                      type: "string",
                      example: "Bogor, Indonesia",
                    },
                    startDate: {
                      type: "string",
                      format: "date",
                    },
                    endDate: {
                      type: "string",
                      format: "date",
                    },
                    gpa: {
                      type: "string",
                      example: 3.8,
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Education created successfully",
            },
          },
        },
      },

      "/api/educations/{id}": {
        patch: {
          summary: "Update education",
          tags: ["Education"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    degree: { type: "string" },
                    school: { type: "string" },
                    location: { type: "string" },
                    startDate: {
                      type: "string",
                      format: "date",
                    },
                    endDate: {
                      type: "string",
                      format: "date",
                    },
                    gpa: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Education updated successfully",
            },
            404: {
              description: "Education not found",
            },
          },
        },

        delete: {
          summary: "Delete education",
          tags: ["Education"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            200: {
              description: "Education deleted successfully",
            },
          },
        },
      },
    },
  },
  apis: [],
};
