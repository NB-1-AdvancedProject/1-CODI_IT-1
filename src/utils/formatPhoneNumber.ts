export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (digitsOnly.length === 11) {
    return digitsOnly.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else {
    return phone;
  }
}