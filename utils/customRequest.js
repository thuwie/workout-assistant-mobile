export default async function sendRequest(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': global.accessToken ? `Bearer ${global.accessToken}` : '',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}