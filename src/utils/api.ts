export async function login(email: string, password: string) {
  const response = await fetch("http://127.0.0.1:8000/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      use_passwords: password,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error en la autenticación");
  }

  const data = await response.json();
  console.log("Respuesta del backend:", data);
  return data;
}
