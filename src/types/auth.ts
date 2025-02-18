
import type { User, Awaitable } from 'next-auth';

export interface CredentialInput {
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface CredentialsConfig<C extends Record<string, CredentialInput> = Record<string, CredentialInput>> {
  id?: string;
  name: string;
  type: 'credentials';
  credentials: C;
  authorize: (credentials: Record<keyof C, string> | undefined) => Awaitable<User | null>;
}

export type CredentialsProvider = <C extends Record<string, CredentialInput>>(
  options: Partial<CredentialsConfig<C>>
) => CredentialsConfig<C>;

export type CredentialsProviderType = 'Credentials';