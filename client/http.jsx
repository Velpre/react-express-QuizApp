import { useEffect, useState } from "react";

export class HttpError extends Error {
  constructor(status, statusText) {
    super("My Custom status text: " + statusText);
    this.status = status
  }
}

export async function fetchJSON(url) {
  const res = await fetch(url);

  if (res.headers.get("content-type") == "application/json; charset=utf-8"){
    return await res.json();
 }else if (!res.ok){
    throw new HttpError(res.status, res.statusText)
  }
}


export async function postJSON(url, userAnswer, question){
  await fetch(url, {
    method: "post",
    body: JSON.stringify({ answer: userAnswer, question }),
    headers: {
      "content-type": "application/json",
    },
  });
}

export function useLodaer(loadingFn) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();

  async function reload() {
    setLoading(true);
    try {
      setData(await loadingFn());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(reload, []);

  return { loading, error, data, reload };
}
