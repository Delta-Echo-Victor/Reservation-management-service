const params        = new URLSearchParams(location.search);
const listing_id    = params.get("listing_id");   
const listing_name  = params.get("name");

document.getElementById("title").textContent = `Booking - ${listing_name}`;

const form = document.getElementById("bookForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const start = new Date(form.start.value);
  const end   = new Date(form.end.value);
  const today = new Date(); today.setHours(0,0,0,0);

  if (isNaN(start) || isNaN(end)) {
    return alert("Please select both check-in and check-out dates.");
  }
  if (start < today) {
    return alert("Start date cannot be in the past.");
  }
  if (end < start) {
    return alert("End date cannot be before start date.");
  }

  const data = Object.fromEntries(new FormData(form).entries());
  data.listing_id = listing_id;           

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json());

    if (res.ok) {
      location.href = `/confirm.html?id=${res.id}`;
    } else {
      alert(res.error || "Server error - please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Network error - please try again.");
  }
});
