async function test() {
  try {
    const url = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent("What is the purpose of life?")}`;
    console.log("Fetching: ", url);
    const res = await fetch(url);
    const json = await res.json();
    console.log("Response:", json);
  } catch(e) {
    console.log(e);
  }
}
test();
