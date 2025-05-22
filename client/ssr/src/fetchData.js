const fetchData = async (token) => {
  if (token) {
    try {
      const response = await fetch(`http://192.168.0.12:8001/admin-panel`, {
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