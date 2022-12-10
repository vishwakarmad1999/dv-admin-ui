const http = async (url) => {
  const resp = await fetch(url);
  const jsonResp = await resp.json();
  return jsonResp;
};

export default http;
