// Lista de usernames reservados (puedes seguir ampliándola)
const RESERVED_USERNAMES = new Set([
    // system
    "admin",
    "root",
    "system",
    "support",
    "help",
    "api",
    "www",
    "mail",
    "ftp",
    "dashboard",
    "settings",
    "config",
    "status",
    "server",
    "app",
    "core",
    "backend",
    "frontend",
  
    // auth / user
    "login",
    "signup",
    "register",
    "logout",
    "user",
    "users",
    "profile",
    "account",
    "me",
    "my",
    "home",
  
    // product routes
    "courses",
    "course",
    "certificates",
    "certificate",
    "dashboard",
    "explore",
    "about",
    "pricing",
    "features",
  
    // legal
    "terms",
    "privacy",
    "policy",
    "legal",
  
    // spam / abuse
    "fuck",
    "shit",
    "admin123",
    "test",
    "testing",
    "null",
    "undefined",
  
    // español
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
  
    // portugués
    "administrador",
    "suporte",
    "ajuda",
    "usuario",
    "usuarios",
    "perfil",
    "conta",
    "inicio",
    "explorar",
    "cursos",
    "certificados",
    "configuracoes"
  ]);
  
  // Normaliza username
  export function normalizeUsername(input: string) {
    return input.toLowerCase().trim();
  }
  
  // Verifica si está reservado
  export function isReservedUsername(username: string) {
    return RESERVED_USERNAMES.has(username);
  }
  
  // Validación principal
  export function validateUsername(input: string) {
    const username = normalizeUsername(input);
  
    // vacío
    if (!username) {
      return {
        isValid: false,
        normalized: username,
        code: "empty",
        message: "Username is required.",
      };
    }
  
    // longitud mínima
    if (username.length < 3) {
      return {
        isValid: false,
        normalized: username,
        code: "too_short",
        message: "Must be at least 3 characters.",
      };
    }
  
    // longitud máxima
    if (username.length > 20) {
      return {
        isValid: false,
        normalized: username,
        code: "too_long",
        message: "Must be at most 20 characters.",
      };
    }
  
    // caracteres válidos
    if (!/^[a-z0-9_]+$/.test(username)) {
      return {
        isValid: false,
        normalized: username,
        code: "invalid_chars",
        message: "Only lowercase letters, numbers, and underscores.",
      };
    }
  
    // no empezar con número
    if (/^[0-9]/.test(username)) {
      return {
        isValid: false,
        normalized: username,
        code: "starts_with_number",
        message: "Cannot start with a number.",
      };
    }
  
    // no doble underscore
    if (/__/.test(username)) {
      return {
        isValid: false,
        normalized: username,
        code: "double_underscore",
        message: "Cannot contain consecutive underscores.",
      };
    }
  
    // no terminar en underscore
    if (/_$/.test(username)) {
      return {
        isValid: false,
        normalized: username,
        code: "ends_with_underscore",
        message: "Cannot end with underscore.",
      };
    }
  
    // palabras reservadas
    if (isReservedUsername(username)) {
      return {
        isValid: false,
        normalized: username,
        code: "reserved",
        message: "This username is not available.",
      };
    }
  
    // válido
    return {
      isValid: true,
      normalized: username,
      code: "valid",
      message: "Username is valid.",
    };
  }