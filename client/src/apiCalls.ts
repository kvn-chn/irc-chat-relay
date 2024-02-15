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

    const data: { message: string, token: string, userId: string } = await response.json();
    console.log('data :', data);

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

        const data: { message: string, username: string } = await response.json();

        return { response, data };
    }

    const response = { ok: false };
    const data = { message: "JWT token is absent" };

    return { response, data };
};

export const logout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export const getChannels = async () => {
    const response = await fetch("http://localhost:4000/channels", {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    });

    const data: { message: string, channels: string[] } = await response.json();

    return { response, data };
}

export const createChannel = async (channel: string, userId: string) => {
    const response = await fetch("http://localhost:4000/channel", {
        method: "POST",
        body: JSON.stringify({ channelName: channel, userId }),
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    });

    const data: { message: string } = await response.json();

    return { response, data };
}

export const getMessages = async (channel: string) => {
    const response = await fetch(`http://localhost:4000/messages/${channel}`, {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    });

    const data: { message: string, messages: { sender: string, message: string, time: string }[] } = await response.json();

    return { response, data };
}

export const messages = async (userId : string) => {
    const response = await fetch(`http://localhost:4000/messages/${userId}`, {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    });

    const data: { message: string, messages: { sender: string, message: string, time: string }[] } = await response.json();

    return { response, data };
}

