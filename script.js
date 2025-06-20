// script.js - Versi Google Sheets Backend (fix event listener delay)

const API_URL = "https://script.google.com/macros/s/AKfycbzqzo9dvEF_umBwcKem9_jNNmUnSLfE2Ll2qxNTkz-sz_Shpw3jHv9uXhLPCQe4drpChA/exec";

// Ambil data menu dari Google Sheets
async function loadMenu() {
  const menuList = document.getElementById("menu-list");
  const menuSelect = document.getElementById("menu-select");
  menuList.innerHTML = "<p>Loading menu...</p>";

  try {
    const res = await fetch(API_URL + "?action=getMenu");
    const data = await res.json();

    menuList.innerHTML = "";
    menuSelect.innerHTML = "<option value=''>Pilih menu</option>";

    data.forEach(item => {
      menuList.innerHTML += `<p>• <strong>${item.nama}</strong>: Rp${item.harga} — Stok: ${item.stok}</p>`;
      menuSelect.innerHTML += `<option value="${item.nama}">${item.nama} (Rp${item.harga})</option>`;
    });
  } catch (err) {
    menuList.innerHTML = "<p class='text-red-600'>Gagal memuat data menu.</p>";
  }
}

// Ambil data kas
async function loadKas() {
  const pemasukan = document.getElementById("pemasukan");
  const pengeluaran = document.getElementById("pengeluaran");
  const saldo = document.getElementById("saldo");

  try {
    const res = await fetch(API_URL + "?action=getKas");
    const data = await res.json();
    pemasukan.innerText = "Rp" + parseInt(data.pemasukan).toLocaleString();
    pengeluaran.innerText = "Rp" + parseInt(data.pengeluaran).toLocaleString();
    saldo.innerText = "Rp" + (parseInt(data.pemasukan) - parseInt(data.pengeluaran)).toLocaleString();
  } catch (err) {
    console.error("Gagal memuat kas:", err);
  }
}

// Jalankan saat halaman siap

document.addEventListener("DOMContentLoaded", () => {
  loadMenu();
  loadKas();

  const formPenjualan = document.getElementById("penjualan-form");
  const formPengeluaran = document.getElementById("pengeluaran-form");

  formPenjualan.addEventListener("submit", async (e) => {
  console.log("🚀 Form penjualan disubmit!"); // Tambahkan ini
  e.preventDefault();

    const item = document.getElementById("menu-select").value;
    const jumlah = document.getElementById("jumlah").value;

    if (!item || jumlah <= 0) return alert("Isi form dengan benar!");

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addPenjualan", item, jumlah })
    });

    alert("✅ Penjualan disimpan!");
    formPenjualan.reset();
    loadMenu();
    loadKas();
  });

  formPengeluaran.addEventListener("submit", async (e) => {
    e.preventDefault();
    const item = document.getElementById("item-pengeluaran").value;
    const jumlah = document.getElementById("jumlah-pengeluaran").value;

    if (!item || jumlah <= 0) return alert("Isi pengeluaran dengan benar!");

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addPengeluaran", item, jumlah })
    });

    alert("✅ Pengeluaran disimpan!");
    formPengeluaran.reset();
    loadKas();
  });
});
