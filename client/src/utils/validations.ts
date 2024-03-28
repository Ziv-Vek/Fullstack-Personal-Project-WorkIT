export function validateEmail(mail: string): boolean {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

export function validatePassword(password: string): boolean {
  return password.length >= 5;

  //  return /^[A-Za-z]\w{5,}$/.test(password);
}

export function validateFullName(fullName: string): boolean {
  return /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/.test(fullName);
}
