export function generateOrderId() {
  const pad = (num, size) => String(num).padStart(size, "0");
  const base = "ESS";
  const date = new Date();
  const y = String(date.getFullYear()).slice(-2);
  const m = pad(date.getMonth() + 1, 2);
  const d = pad(date.getDate(), 2);
  const s = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);
  const rand = Math.floor(Math.random() * 8999 + 1000); // 4-digit so unique .vin
  return `${base}${y}${m}${d}${s}${ms}${rand}`;
}
