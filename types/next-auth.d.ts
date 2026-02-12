import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    organizationId?: string;
    organizationName?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      organizationId: string;
      organizationName: string;
    };
  }
}
