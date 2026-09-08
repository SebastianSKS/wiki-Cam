/**
 * Resolución de credenciales de base de datos.
 *
 * En producción / con Turso configurado se usa la URL `libsql://…` remota.
 * Si las variables aún tienen el placeholder `<TU_…>` o están vacías, se cae
 * a un archivo SQLite local (`./local.db`) para que el desarrollo funcione
 * sin cuenta de Turso. No importa `dotenv` a propósito: Next carga `.env.local`
 * automáticamente y los scripts (seed / drizzle-kit) lo cargan ellos mismos.
 */
export type DbCredentials = {
  url: string;
  authToken?: string;
};

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.trim();
  return v.length === 0 || v.startsWith("<") || v.includes("TU_TURSO");
}

export function resolveDbCredentials(): DbCredentials {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (isPlaceholder(url)) {
    return { url: "file:local.db" };
  }

  return {
    url: url as string,
    authToken: isPlaceholder(authToken) ? undefined : authToken,
  };
}

export const usingLocalFallback = (): boolean =>
  isPlaceholder(process.env.TURSO_DATABASE_URL?.trim());
