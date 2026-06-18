/**
 * Quote JSON Exporter
 * Generates a comprehensive JSON structure for AI model project generation
 */

import type { PageSpec, RelationSpec } from "@/src/types/quote";

export interface FeatureFlags {
  login: boolean;
  encrypt: boolean;
  jwt: boolean;
  admin: boolean;
  email: boolean;
  upload: boolean;
  search: boolean;
  fk: boolean;
}

export interface FieldDefinition {
  name: string;
  type: string;
  constraints?: {
    primaryKey?: boolean;
    nullable?: boolean;
    unique?: boolean;
  };
}

export interface TableDefinition {
  name: string;
  fields: FieldDefinition[];
  crud: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    search: boolean;
  };
}

export interface RelationshipDefinition {
  sourceTable: string;
  targetTable: string;
  type: "one-to-many" | "one-to-one" | "many-to-many";
  foreignKey?: string;
}

export interface ProjectSpecification {
  // Metadata
  metadata: {
    generatedAt: string;
    version: string;
    generator: string;
  };

  // Client Information
  client: {
    name: string;
    email: string;
    whatsapp?: string;
    university?: string;
    description?: string;
  };

  // Technology Stack
  stack: {
    frontend: {
      framework: string;
      language: string;
    };
    backend: {
      framework: string;
      runtime?: string;
    };
    database: {
      engine: string;
    };
  };

  // Features & Modules
  features: {
    authentication: {
      enabled: boolean;
      methods: string[];
    };
    security: {
      passwordEncryption: boolean;
      jwtTokens: boolean;
    };
    adminPanel: {
      enabled: boolean;
    };
    communication: {
      emailAutomation: boolean;
    };
    fileManagement: {
      fileUploads: boolean;
    };
    search: {
      globalSearch: boolean;
    };
  };

  // Database Schema
  database: {
    tables: TableDefinition[];
    relationships: RelationshipDefinition[];
  };

  // API Endpoints (generated from CRUD operations)
  apiEndpoints: {
    path: string;
    methods: string[];
    description: string;
  }[];

  // Project Timeline
  timeline: {
    estimatedDays: number;
    phases: {
      name: string;
      duration: number;
      tasks: string[];
    }[];
  };

  // Pricing Breakdown
  pricing: {
    breakdown: {
      label: string;
      value: number;
    }[];
    total: number;
  };
}

/**
 * Generate a comprehensive JSON specification for AI model project generation
 */
export function generateProjectSpecification(data: {
  clientName: string;
  clientEmail: string;
  clientUni?: string;
  clientWa?: string;
  clientDesc?: string;
  frontend: string;
  devLanguage: string;
  backend: string;
  database: string;
  features: FeatureFlags;
  pages: PageSpec[];
  relations: RelationSpec[];
  days: number;
  breakdown: { label: string; val: number }[];
  total: number;
}): ProjectSpecification {
  const {
    clientName,
    clientEmail,
    clientUni,
    clientWa,
    clientDesc,
    frontend,
    devLanguage,
    backend,
    database,
    features,
    pages,
    relations,
    days,
    breakdown,
    total,
  } = data;

  // Map relation types to standard format
  const mapRelationType = (type: string): "one-to-many" | "one-to-one" | "many-to-many" => {
    if (type.includes("1:N") || type.includes("Has Many")) return "one-to-many";
    if (type.includes("1:1") || type.includes("Belongs To")) return "one-to-one";
    if (type.includes("M:N") || type.includes("Many to Many")) return "many-to-many";
    return "one-to-many"; // default
  };

  // Convert pages to table definitions
  const tables: TableDefinition[] = pages.map((page) => {
    const fields: FieldDefinition[] = page.fields.map((field, idx) => ({
      name: field.label,
      type: mapFieldType(field.type),
      constraints: {
        primaryKey: idx === 0 && field.label.toLowerCase() === "id",
        nullable: idx > 0,
        unique: idx === 0 && field.label.toLowerCase() === "id",
      },
    }));

    return {
      name: page.topic,
      fields,
      crud: {
        create: page.create,
        read: page.read,
        update: page.update,
        delete: page.delete,
        search: page.search,
      },
    };
  });

  // Convert relations to relationship definitions
  const relationships: RelationshipDefinition[] = relations.map((rel) => ({
    sourceTable: rel.sourceTable,
    targetTable: rel.targetTable,
    type: mapRelationType(rel.relationType),
  }));

  // Generate API endpoints from CRUD operations
  const apiEndpoints = pages.flatMap((page) => {
    const endpoints = [];
    const basePath = `/api/${page.topic.toLowerCase()}`;

    if (page.create) {
      endpoints.push({
        path: basePath,
        methods: ["POST"],
        description: `Create new ${page.topic} record`,
      });
    }

    if (page.read) {
      endpoints.push(
        {
          path: basePath,
          methods: ["GET"],
          description: `Get all ${page.topic} records`,
        },
        {
          path: `${basePath}/:id`,
          methods: ["GET"],
          description: `Get ${page.topic} by ID`,
        }
      );
    }

    if (page.update) {
      endpoints.push({
        path: `${basePath}/:id`,
        methods: ["PUT", "PATCH"],
        description: `Update ${page.topic} by ID`,
      });
    }

    if (page.delete) {
      endpoints.push({
        path: `${basePath}/:id`,
        methods: ["DELETE"],
        description: `Delete ${page.topic} by ID`,
      });
    }

    if (page.search) {
      endpoints.push({
        path: `${basePath}/search`,
        methods: ["GET"],
        description: `Search ${page.topic} records`,
      });
    }

    return endpoints;
  });

  // Map field types to database types
  function mapFieldType(type: string): string {
    const typeMap: Record<string, string> = {
      Integer: "integer",
      String: "string",
      Float: "float",
      Date: "datetime",
      Boolean: "boolean",
      "Image/File": "string",
      Email: "string",
      Phone: "string",
      Text: "text",
    };
    return typeMap[type] || "string";
  }

  // Build authentication methods array
  const authMethods: string[] = [];
  if (features.login) authMethods.push("email-password");
  if (features.jwt) authMethods.push("jwt");

  // Calculate phase durations
  const devPhase = Math.round(days * 0.6);
  const testPhase = Math.round(days * 0.25);
  const deployPhase = days - devPhase - testPhase;

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0.0",
      generator: "Dev+ Quote Builder",
    },

    client: {
      name: clientName,
      email: clientEmail,
      whatsapp: clientWa,
      university: clientUni,
      description: clientDesc,
    },

    stack: {
      frontend: {
        framework: frontend,
        language: devLanguage,
      },
      backend: {
        framework: backend,
        runtime: devLanguage === "TypeScript" || devLanguage === "JavaScript" ? "Node.js" : "JVM",
      },
      database: {
        engine: database,
      },
    },

    features: {
      authentication: {
        enabled: features.login,
        methods: authMethods,
      },
      security: {
        passwordEncryption: features.encrypt,
        jwtTokens: features.jwt,
      },
      adminPanel: {
        enabled: features.admin,
      },
      communication: {
        emailAutomation: features.email,
      },
      fileManagement: {
        fileUploads: features.upload,
      },
      search: {
        globalSearch: features.search,
      },
    },

    database: {
      tables,
      relationships,
    },

    apiEndpoints,

    timeline: {
      estimatedDays: days,
      phases: [
        {
          name: "Development",
          duration: devPhase,
          tasks: [
            "Set up project structure",
            "Implement authentication system",
            "Create database models",
            "Build API endpoints",
            "Develop frontend components",
            "Implement CRUD operations",
          ],
        },
        {
          name: "Testing & QA",
          duration: testPhase,
          tasks: [
            "Unit testing",
            "Integration testing",
            "User acceptance testing",
            "Bug fixes",
          ],
        },
        {
          name: "Deployment",
          duration: deployPhase,
          tasks: [
            "Set up production environment",
            "Deploy application",
            "Configure database",
            "Final testing",
          ],
        },
      ],
    },

    pricing: {
      breakdown: breakdown.map((item) => ({
        label: item.label,
        value: item.val,
      })),
      total,
    },
  };
}

/**
 * Download the JSON specification as a file
 */
export function downloadJSON(spec: ProjectSpecification, filename?: string): void {
  const json = JSON.stringify(spec, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `project-spec-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}