const http = async (url) => {
  const resp = await fetch(url);
  const json_resp = await resp.json();
  return json_resp;
};

export default json_resp;
