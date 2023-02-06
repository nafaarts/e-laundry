export function currencyFormat(num) {
  if (typeof num === "string") {
    num = parseInt(num)
  }
  return "Rp " + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}
