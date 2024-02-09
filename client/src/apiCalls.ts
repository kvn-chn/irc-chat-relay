export const register = async (username: string, password: string) => {
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  
    const data: { message: string } = await response.json();
  
    return { response, data };
}
  
export const login = async (username: string, password: string) => {
    const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    });

    const data: { message: string, token: string } = await response.json();

    return { response, data };
}

export const clearToken = async () => {
    const response = await fetch("http://localhost:4000/clear", {
        method: "DELETE"
    });

    const data: { message: string } = await response.json();

    return { response, data };
}