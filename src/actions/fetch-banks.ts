"use server";
async function fetchBanks() {
  const response = await fetch(
    "https://mojoapi.crosslinkglobaltravel.com/api/transfers/banks"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch banks");
  }
  return response.json();
}
