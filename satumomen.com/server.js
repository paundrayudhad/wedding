const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Atur CORS agar frontend bisa mengakses server
const cors = require('cors');
app.use(cors());

const dataFilePath = path.join(__dirname, 'rsvp_data.json');

// Fungsi untuk membaca data dari file
const readData = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(dataFilePath);
        // Jika file kosong, kembalikan array kosong
        return jsonData.length > 0 ? JSON.parse(jsonData) : [];
    } catch (error) {
        return []; // Jika ada error parsing, kembalikan array kosong
    }
};

// Fungsi untuk menulis data ke file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// ENDPOINT BARU: untuk mengambil semua data RSVP
app.get('/get-rsvp', (req, res) => {
    const rsvpData = readData();
    res.json(rsvpData);
});

// Endpoint untuk menyimpan data RSVP baru
app.post('/simpan-rsvp', (req, res) => {
    const rsvpData = readData();
    const newEntry = {
        name: req.body.name,
        relation: req.body.relation,
        hadir: req.body.hadir,
        jumlah: parseInt(req.body.jumlah),
        ucapan: req.body.ucapan
    };

    rsvpData.push(newEntry);
    writeData(rsvpData);

    console.log('Data baru disimpan:', newEntry);
    res.status(200).json({ message: 'Konfirmasi Anda berhasil dikirim!' });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log('Server siap menerima data RSVP.');
});
