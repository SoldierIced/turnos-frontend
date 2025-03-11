import { registerUser, saveCookie } from "../../../../services/auth.service";

export async function POST(req) {
  try {
    const { name, phone, email, password } = await req.json();
    const data = await registerUser(name, phone, email, password);

    // Guardar el token en una cookie HTTP-Only
    await saveCookie("access_token", data.access_token);
    await saveCookie("user", data.user);

    return Response.json(data, { status: 201 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 400 });
  }
}
