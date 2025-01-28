const API_URL = "https://api-inference.huggingface.co/models/gpt2"

export async function query(data: { inputs: string }) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
  const result = await response.json()
  return result
}

