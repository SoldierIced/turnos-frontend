import { loginUser, saveCookie } from "../../../../services/auth.service";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const data = await loginUser(email, password);

    await saveCookie("access_token", data.access_token);
    await saveCookie("user", data.user);

    return Response.json(data, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 401 });
  }
}
