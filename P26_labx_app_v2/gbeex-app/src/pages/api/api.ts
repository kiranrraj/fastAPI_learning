export async function loginWithFastAPI(email: string, password: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return {
        id: data._id, // required by NextAuth
        name: data.username,
        email: data.email,
        access_token: data.access_token,
        role: data.role,
        entity_access: data.entity_access,
    };
}
