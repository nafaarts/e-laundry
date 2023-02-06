export function passwordValidator(password) {
  if (!password) return "Password tidak boleh kosong!."
  if (password.length < 5)
    return "Password harus memiliki paling tidak 5 karakter"
  return ""
}
