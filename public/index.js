const form   = document.getElementById("filterForm");
const output = document.getElementById("results");

form.addEventListener("submit", e => {
  e.preventDefault();
  const qs = new URLSearchParams(new FormData(form)).toString();
  fetchAndRender(`/api/listings?${qs}`,
    data => `<h2>${data.length} Listings that match your preferences</h2>`);
});

window.addEventListener("DOMContentLoaded", () =>
  fetchAndRender("/api/listings/all",
    () => `<h2>Here are some of our listings for you</h2>`)
);

async function fetchAndRender(url, headingFn) {
  try {
    const data = await fetch(url).then(r => r.json());
    if (!Array.isArray(data)) throw new Error(data.error || "Server error");
    render(data, headingFn(data));
  } catch (err) {
    console.error(err);
    output.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

function render(listings, headingHtml) {
  output.innerHTML = `
    ${headingHtml}
    ${listings.map(l => `
      <div class="listing">
        <img src="${l.picture || ''}" alt="${l.name}" />
        <h2><a href="/bookings.html?listing_id=${l.id}&name=${encodeURIComponent(l.name)}">${l.name}</a></h2>
        <p>${l.summary ?? "No summary"}</p>
        <p>Daily Rate: ${l.price || "n/a"}</p>
        <p>Customer Rating: ${l.rating ?? "n/a"}</p>
      </div>`).join("")}`;
}