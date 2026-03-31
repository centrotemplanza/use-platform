const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "system",
  "owner",
  "founder",
  "team",
  "staff",
  "support",
  "help",
  "contact",
  "legal",
  "security",
  "moderator",
  "mod",
  "login",
  "signin",
  "signup",
  "register",
  "logout",
  "auth",
  "password",
  "reset",
  "verify",
  "dashboard",
  "profile",
  "account",
  "settings",
  "preferences",
  "me",
  "user",
  "users",
  "home",
  "about",
  "courses",
  "course",
  "community",
  "forum",
  "groups",
  "group",
  "billing",
  "payment",
  "payments",
  "checkout",
  "subscription",
  "subscriptions",
  "plan",
  "plans",
  "pricing",
  "api",
  "webhook",
  "webhooks",
  "internal",
  "private",
  "public",
  "static",
  "assets",
  "cdn",
  "terms",
  "privacy",
  "cookies",
  "policy",
  "policies",
  "new",
  "edit",
  "create",
  "delete",
  "update",
  "view",
  "open",
  "close",
  "send",
  "share",
  "u",
  "id",
  "www",
  "mail",
  "email",
  "sms",
  "ftp",
  "http",
  "https",
  "use",
  "unifiedselfevolution",
  "templanza",
  "empowerapp",
  "centrotemplanza",
  "administrador",
  "soporte",
  "ayuda",
  "usuario",
  "usuarios",
  "perfil",
  "cuenta",
  "inicio",
  "explorar",
  "cursos",
  "certificados",
  "configuracion",
  "ajustes",
  "entrar",
  "registrar",
  "cadastro",
  "sair",
  "conta",
  "configuracoes",
]);

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export function normalizeUsername(input: string) {
  return input.toLowerCase().trim();
}

export function isReservedUsername(username: string) {
  return RESERVED_USERNAMES.has(username);
}

export function validateUsername(input: string) {
  const username = normalizeUsername(input);

  if (!username) {
    return {
      isValid: false,
      normalized: username,
      code: "empty",
      message: "Username is required.",
    };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      isValid: false,
      normalized: username,
      code: "too_short",
      message: "Must be at least 3 characters.",
    };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      normalized: username,
      code: "too_long",
      message: "Must be at most 20 characters.",
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      normalized: username,
      code: "invalid_chars",
      message: "Only lowercase letters, numbers, and underscores.",
    };
  }

  if (/^[0-9]/.test(username)) {
    return {
      isValid: false,
      normalized: username,
      code: "starts_with_number",
      message: "Cannot start with a number.",
    };
  }

  if (/__/.test(username)) {
    return {
      isValid: false,
      normalized: username,
      code: "double_underscore",
      message: "Cannot contain consecutive underscores.",
    };
  }

  if (/_$/.test(username)) {
    return {
      isValid: false,
      normalized: username,
      code: "ends_with_underscore",
      message: "Cannot end with underscore.",
    };
  }

  if (isReservedUsername(username)) {
    return {
      isValid: false,
      normalized: username,
      code: "reserved",
      message: "This username is not available.",
    };
  }

  return {
    isValid: true,
    normalized: username,
    code: "valid",
    message: "Username is valid.",
  };
}

