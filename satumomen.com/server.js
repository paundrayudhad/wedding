const express = require('express');
const { kv } = require('@vercel/kv'); // Import Vercel KV
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const RSVP_KEY = 'rsvp_data'; // Kunci untuk menyimpan data di Vercel KV

// ENDPOINT: untuk mengambil semua data RSVP
app.get('/get-rsvp', async (req, res) => {
    try {
        const rsvpData = await kv.get(RSVP_KEY);
        res.status(200).json(rsvpData || []);
    } catch (error) {
        console.error('Error reading from Vercel KV:', error);
        res.status(500).json({ message: 'Gagal mengambil data RSVP.' });
    }
});

// Endpoint untuk menyimpan data RSVP baru
app.post('/simpan-rsvp', async (req, res) => {
    try {
        // Ambil data yang ada
        let rsvpData = await kv.get(RSVP_KEY) || [];

        const newEntry = {
            name: req.body.name,
            relation: req.body.relation,
            hadir: req.body.hadir,
            jumlah: parseInt(req.body.jumlah),
            ucapan: req.body.ucapan
        };

        // Tambahkan data baru
        rsvpData.push(newEntry);

        // Simpan kembali ke Vercel KV
        await kv.set(RSVP_KEY, rsvpData);

        console.log('Data baru disimpan:', newEntry);
        res.status(200).json({ message: 'Konfirmasi Anda berhasil dikirim!' });

    } catch (error) {
        console.error('Error writing to Vercel KV:', error);
        res.status(500).json({ message: 'Gagal menyimpan konfirmasi.' });
    }
});

// Penting: Export 'app' untuk Vercel
module.exports = app;
