// Configurable con EXPO_PUBLIC_API_URL (ver .env). Un dispositivo no resuelve dominios locales como *.test.
//const API_BASE_URL = "https://safety_web.test/api/appsafety.php";
const API_BASE_URL = "https://safetyp.unicommplus.mx/api/appsafety.php";

export const apiUrl = (action: string) => `${API_BASE_URL}?action=${action}`;
