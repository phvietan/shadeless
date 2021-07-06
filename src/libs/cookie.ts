export function getCookie (name: string): string {
  type StringStringObject = {
    [name: string]: string
  }
  const cookie: StringStringObject = {};
  document.cookie.split(';').forEach(function (el) {
    const [k, v] = el.split('=');
    cookie[k.trim()] = v;
  });
  return cookie[name] ?? '';
}

export function setCookie (name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

export function deleteCookie (name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
