export default async function sendRequest(url, method, body) {
  if (method === 'GET' || method === 'HEAD') {
    const response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': global.accessToken ? `Bearer ${global.accessToken}` : '',
      },
    });
    return response.json();
  } else {
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

}