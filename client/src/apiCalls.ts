export const register = async (username: string, password: string) => {
    const response = await fetch("http://localhost:4000/user/register", {
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
    const response = await fetch("http://localhost:4000/user/login", {
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

export const checkToken = async () => {
    const getJwtToken = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'jwt') {
            return value;
            }
        }
        return null;
    };

    const jwtToken = getJwtToken();

    if (jwtToken) {
        const response = await fetch("http://localhost:4000/verifyToken", {
        method: "POST",
        body: JSON.stringify({ token: jwtToken }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        });

        const data: { message: string, id: number, username: string } = await response.json();

        return { response, data };
    }

    const response = { ok: false };
    const data = { message: "JWT token is absent" };

    return { response, data };
};

export const clearCookie = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}