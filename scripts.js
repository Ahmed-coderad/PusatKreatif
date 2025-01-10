
document.addEventListener("DOMContentLoaded", () => {
    const btnAsetDigital = document.getElementById("btnAsetDigital");
    const btnAsetNFT = document.getElementById("btnAsetNFT");
    const btnBuatAset = document.getElementById("btnBuatAset");
    const btnAsetInspiratif = document.getElementById("btnAsetInspiratif");

    // Tambahkan event listener untuk tombol menu
    btnAsetDigital.addEventListener('click', () => showMenu('menu1'));
    btnAsetNFT.addEventListener('click', () => showMenu('menu2'));
    btnBuatAset.addEventListener('click', () => showMenu('menu3'));
    btnAsetInspiratif.addEventListener('click', () => showMenu('menu4'));

    // Event untuk overlay agar menutup menu
    document.getElementById("overlay").addEventListener('click', closeMenu);
});

function showMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    // Tutup semua menu
    document.querySelectorAll('.menu').forEach(menu => menu.classList.add('hidden'));

    // Tampilkan overlay dan submenu
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    overlay.style.pointerEvents = 'auto'; // Aktifkan klik pada overlay
    menu.classList.remove('hidden');
}

function closeMenu() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none'; // Sembunyikan overlay
    overlay.style.pointerEvents = 'none'; // Nonaktifkan klik pada overlay
    document.querySelectorAll('.menu').forEach(menu => menu.classList.add('hidden'));
}

function unmuteVideo() {
        const video = document.getElementById('portfolioVideo');
	const musicIcon = document.getElementById('musicIcon');
    	const unmuteButton = document.getElementById('unmuteButton');
        video.muted = false;
        video.play();
        document.getElementById('unmuteButton').style.display = 'none';
        document.getElementById('musicIcon').classList.remove('hidden');
    }

function toggleTranslation() {
    const headerTitle1 = document.querySelector("header h1:nth-of-type(1)");
    const headerTitle2 = document.querySelector("header h1:nth-of-type(2)");
    const subtitle = document.getElementById("subtitle");
    const translateButton = document.getElementById("translateButton");
    const unmuteButton = document.getElementById("unmuteButton");

    const btnAsetDigital = document.getElementById("btnAsetDigital");
    const btnAsetNFT = document.getElementById("btnAsetNFT");
    const btnBuatAset = document.getElementById("btnBuatAset");
    const btnAsetInspiratif = document.getElementById("btnAsetInspiratif");
     
    const isEnglish = translateButton.textContent === "English translation";

    if (isEnglish) {
        // Ubah teks ke bahasa Inggris
        headerTitle1.textContent = "WELCOME";
        headerTitle2.innerHTML = "TO THE DIGITAL CREATIVITY CENTER <span>RAD</span>!";
        subtitle.innerHTML = "Hi! Visionaries, Editors, or Creators looking for inspiration! <span class='icon'>🌟</span><br>You have just stepped into a world where visual ideas come to life and digital art tells stories with aesthetics.";
        translateButton.textContent = "Bahasa Indonesia";
	unmuteButton.textContent = "Enable Sound 🎵";

        // Ubah teks tombol menu utama
        btnAsetDigital.textContent = "Digital Art Assets";
        btnAsetNFT.textContent = "NFT Art Assets";
        btnBuatAset.textContent = "Create Assets";
        btnAsetInspiratif.textContent = "Inspirational Assets";
    } else {
        // Ubah teks kembali ke bahasa Indonesia
        headerTitle1.textContent = "SELAMAT DATANG";
        headerTitle2.innerHTML = "DI PUSAT KREATIVITAS DIGITAL <span>RAD</span>!";
        subtitle.innerHTML = "Hai! Visioner, Editor, atau Kreator pencari inspirasi! <span class='icon'>🌟</span><br>Anda baru saja melangkah ke dunia di mana ide-ide visual hidup dan seni digital bercerita dengan estetik.";
        translateButton.textContent = "English translation";
	unmuteButton.textContent = "Aktifkan Suara 🎵";

        // Ubah teks tombol menu utama
        btnAsetDigital.textContent = "Aset Seni Digital";
        btnAsetNFT.textContent = "Aset Seni NFT";
        btnBuatAset.textContent = "Buat Aset";
        btnAsetInspiratif.textContent = "Aset Inspiratif";
    }
}

const giftBox = document.getElementById('giftBox');
const tooltip = document.getElementById('tooltip');
const giftModal = document.getElementById('giftModal');
const backButton = document.getElementById('backButton');

let hideTimeout;

giftBox.addEventListener('mouseenter', () => {
    console.log('Mouse entered gift box');
    tooltip.classList.add('visible');
    tooltip.classList.remove('hidden');
});
giftBox.addEventListener('mouseleave', () => {
    console.log('Mouse left gift box');
    tooltip.classList.add('hidden');
    tooltip.classList.remove('visible');
});



        // Handle click event
        giftBox.addEventListener('click', async () => {
    tooltip.classList.add('hidden'); // Sembunyikan tooltip
    giftBox.classList.add('hidden'); // Sembunyikan kado
    giftModal.style.display = 'block'; // Tampilkan modal

    const cid = 'bafkreielbaxco67amijkxbfbtziahqfjm7qexlblztzgtf2awuv646lwna';
    const gateways = [
        'https://cloudflare-ipfs.com/ipfs/',
        'https://gateway.pinata.cloud/ipfs/',
        'https://infura-ipfs.io/ipfs/'
    ];
    let fileFound = false;

    for (let i = 0; i < gateways.length; i++) {
        const fileUrl = `${gateways[i]}${cid}`;
        try {
            const response = await fetch(fileUrl);

            if (response.ok) {
                fileFound = true;

                // Unduh dan tampilkan gambar
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                // Update gambar modal
                const modalImage = document.getElementById('modalImage');
                modalImage.src = blobUrl;

                // Unduh otomatis gambar
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'Kucing_ISTJ.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                break; // Keluar dari loop jika file ditemukan
            }
        } catch (error) {
            console.error(`Error fetching from gateway ${gateways[i]}:`, error);
        }
    }

    if (!fileFound) {
        console.error("File not found in any gateway.");
    }
});

function hideGiftBox() {
    giftBox.style.display = 'none'; // Sembunyikan elemen
    hideTimeout = setTimeout(showGiftBox, 6000); // Tampilkan kembali setelah 6 detik
}

function showGiftBox() {
    giftBox.style.display = 'flex'; // Pastikan elemen kembali terlihat
}


        // Auto-hide setelah 3 detik
let activityTimer = setTimeout(hideGiftBox, 3000);

function resetActivityTimer() {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(hideGiftBox, 3000);
}

       // Reset waktu jika ada aktivitas
document.addEventListener('mousemove', resetActivityTimer);
document.addEventListener('keydown', resetActivityTimer);

// Tampilkan modal hadiah saat kado diklik
giftBox.addEventListener('click', () => {
    document.body.classList.add('modal-active'); // Tambahkan kelas untuk menyembunyikan elemen lain
    giftModal.style.display = 'block'; // Tampilkan modal
});

// Sembunyikan modal dan kembali ke tampilan awal
backButton.addEventListener('click', () => {
    giftModal.style.display = 'none'; // Sembunyikan modal
    document.body.classList.remove('modal-active'); // Hapus kelas untuk menampilkan elemen lain
});

function showElement(element) {
    element.classList.add('is-visible');
    element.classList.remove('is-hidden');
}

function hideElement(element) {
    element.classList.add('is-hidden');
    element.classList.remove('is-visible');
}

document.addEventListener('scroll', () => {
    const giftBox = document.getElementById('giftBox');
    const scrollPosition = window.innerHeight + window.scrollY; // Posisi gulir
    const pageHeight = document.documentElement.offsetHeight; // Tinggi halaman

    if (scrollPosition >= pageHeight - 50) {
        // Jika pengguna hampir mencapai bagian bawah halaman
        giftBox.style.display = 'flex'; // Tampilkan elemen kado
    } else {
        giftBox.style.display = 'none'; // Sembunyikan elemen kado
    }
});

window.addEventListener('resize', () => {
    const giftBox = document.getElementById('giftBox');
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) { // HP kecil
        giftBox.style.bottom = '8vh';
        giftBox.style.left = '5vw';
    } else if (screenWidth <= 1024) { // Tablet
        giftBox.style.bottom = '9vh';
        giftBox.style.left = '3vw';
    } else { // Laptop dan lebih besar
        giftBox.style.bottom = '10vh';
        giftBox.style.left = '2vw';
    }
});

// Fungsi untuk tombol like
const likeButton = document.getElementById('likeButton');
likeButton.addEventListener('click', () => {
    alert('Kamu menyukai hadiah ini! ❤️');
});

// Fungsi untuk tombol English translation
const translateButtonModal = document.getElementById('translateButtonModal');
translateButtonModal.addEventListener('click', () => {
    const title = document.querySelector('.modal-title'); // Elemen SELAMAT
    const subtitle = document.querySelector('.modal-subtitle');
    const description = document.querySelector('.modal-description');

    const isIndonesian = translateButtonModal.textContent === 'English translation';

    if (isIndonesian) {
        title.textContent = 'CONGRATULATIONS';
        subtitle.textContent = 'You got';
        description.innerHTML = `<strong>CAT ISTJ</strong><br>
            Organized, traditional, and responsible. ISTJ cats love routines and are very meticulous.`;
        translateButtonModal.textContent = 'Bahasa Indonesia';
    } else {
        title.textContent = 'SELAMAT';
        subtitle.textContent = 'kamu mendapatkan';
        description.innerHTML = `<strong>KUCING ISTJ</strong><br>
            Terorganisir, tradisional, dan bertanggung jawab. Kucing ISTJ suka rutinitas dan sangat teliti.`;
        translateButtonModal.textContent = 'English translation';
    }
});


window.addEventListener('resize', () => {
    const modal = document.getElementById('giftModal');
    if (modal.style.display === 'block') {
        modal.style.top = `${window.innerHeight / 2}px`;
        modal.style.left = `${window.innerWidth / 2}px`;
        modal.style.transform = 'translate(-50%, -50%)';
    }
});
