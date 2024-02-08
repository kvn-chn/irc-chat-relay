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
  
export const login = async (email: string, password: string) => {
    const saveJwtToCookie = (jwtToken: string) => {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000); // 1 hour in milliseconds

        document.cookie = `jwt=${jwtToken}; expires=${expirationDate.toUTCString()}; path=/;`;
    };

    const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    });

    const data: { message: string, token: string } = await response.json();

    if (response.ok) saveJwtToCookie(data.token);

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
        const response = await fetch("http://localhost:8080/verifyToken", {
        method: "POST",
        body: JSON.stringify({ token: jwtToken }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        });

        const data: { message: string, id: number, email: string } = await response.json();

        return { response, data };
    }

    const response = { ok: false };
    const data = { message: "JWT token is absent" };

    return { response, data };
};

export const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}