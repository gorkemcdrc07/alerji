import React, { useState } from 'react';
import { Typography, Box, Button, Paper, Stack, CircularProgress } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useNavigate } from 'react-router-dom';

// YENİ KÜTÜPHANE IMPORT'U
import { Scanner } from '@yudiel/react-qr-scanner';

const Scan = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const [lastScanResult, setLastScanResult] = useState(null);

    // Yeni kütüphanenin sonuç işleyici fonksiyonu
    const handleScan = (result) => {
        // result bir dizi olduğu için ilk sonucu alıyoruz
        if (result && result.length > 0) {
            const barcode = result[0].rawValue;
            setLastScanResult(barcode); // Tarama başarılı
            setIsScanning(false); // Kamerayı kapat
            setError('');

            // Sonuç sayfasına yönlendir
            navigate(`/result/${barcode}`);
        }
    };

    // Yeni kütüphanenin hata işleyici fonksiyonu
    const handleError = (err) => {
        // Tarayıcı izin reddi gibi spesifik hataları yakala
        if (err.name === 'NotAllowedError') {
            setError('Kamera erişimi reddedildi. Lütfen tarayıcı ayarlarından izin verin.');
        } else if (err.name === 'NotFoundError') {
            setError('Cihazda uygun kamera bulunamadı.');
        } else {
            // console.error(err); // Detaylı hataları konsola yazdır
            setError('Tarama sırasında bilinmeyen bir hata oluştu.');
        }
        // Hata durumunda taramayı durdur
        setIsScanning(false);
    };

    const startScan = () => {
        setLastScanResult(null);
        setIsScanning(true);
        setError('');
    };

    const stopScan = () => {
        setIsScanning(false);
    };

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                gap: 3
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'white',
                    width: '100%',
                    maxWidth: 400,
                    border: '4px solid',
                    borderColor: isScanning ? 'error.main' : 'primary.main',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Stack spacing={2} alignItems="center">

                    {/* Tarayıcı Alanı */}
                    {isScanning ? (
                        <Box
                            sx={{
                                width: '100%',
                                height: 300,
                                overflow: 'hidden',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Scanner
                                onScan={handleScan} // Başarılı taramada çağrılır
                                onError={handleError} // Hata oluştuğunda çağrılır
                                styles={{
                                    container: { width: '100%', height: '100%' },
                                    video: { objectFit: 'cover' }
                                }}
                            // constraints'i kaldırdık, tarayıcıya bırakıyoruz.
                            />
                        </Box>
                    ) : (
                        // Tarayıcı kapalıyken gösterilecek ikon
                        <QrCodeScannerIcon
                            sx={{
                                fontSize: 100,
                                color: 'primary.dark',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    )}

                    <Typography
                        variant="h5"
                        component="h1"
                        fontWeight="bold"
                        color="primary.main"
                        gutterBottom
                    >
                        {isScanning ? 'Tarama Başlatıldı...' : 'Ürün Tarama Alanı'}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {isScanning
                            ? 'Barkodu veya QR kodu kamera alanına ortalayın.'
                            : 'Alerji kontrolü için barkodu taramak üzere butona basın.'
                        }
                    </Typography>

                    {/* Hata Mesajı */}
                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                </Stack>
            </Paper>

            {/* Tarama Butonu */}
            {!isScanning ? (
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={startScan}
                    startIcon={<QrCodeScannerIcon />}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        height: 55,
                        borderRadius: 3,
                        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)'
                    }}
                >
                    Kamera ile Taramayı Başlat
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={stopScan}
                    startIcon={<VideocamOffIcon />}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        height: 55,
                        borderRadius: 3,
                        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.4)'
                    }}
                >
                    Taramayı Durdur
                </Button>
            )}

            <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => navigate(`/result/869000000001`)}
                sx={{ mt: 2 }}
            >
                Simülasyonla Test Et (869000000001)
            </Button>

        </Box>
    );
};

export default Scan;