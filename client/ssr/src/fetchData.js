const IP = process.env.IP
const KEYCLOAK_URL = process.env.KEYCLOAK_URL
const USER_URL = process.env.USER_URL

const fetchData = async (token) => {
  if (token) {
    try {
      const response = await fetch(`${USER_URL}/admin-panel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {error: "Przepraszamy błąd po stronie serwera"}
      }

      const usersData = await response.json();
      return usersData
    } catch (error) {
      return {error: "Błąd podcas pobierania danych"}
    }
  } else {
      return {error: "Brak tokenu"}
  }
}

export default fetchData