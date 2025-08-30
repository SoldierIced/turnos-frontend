import { loginUser, saveCookie } from "../../../../services/auth.service";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const data = await loginUser(email, password); // { access_token, user }

    // Token: SIEMPRE HttpOnly
    await saveCookie("access_token", data.access_token, { httpOnly: true });

    // User: HttpOnly (lo leeremos mediante /api/me)
    await saveCookie("user", data.user, { httpOnly: true });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 401 });
  }
}
