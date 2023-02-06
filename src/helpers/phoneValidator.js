export function phoneValidator(name) {
  const re = /^(^62|^08)(\d{3,4}-?){2}\d{3,4}$/
  if (!name) return "Nomor Handphone tidak boleh kosong!"
  if (!re.test(name))
    return "Ooops! Sepertinya bukan Nomor Handphone yang valid"
  return ""
}
