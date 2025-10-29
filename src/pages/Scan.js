import React, { useState } from 'react';
import { Typography, Box, Button, Paper, Stack, CircularProgress } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader'; // Yeni kütüphanemiz

const Scan = () => {
    const navigate = useNavigate();
    // Tarayıcı (kamera) görünürlüğünü yönetmek için state
    const [isScanning, setIsScanning] = useState(false);
    // Hata mesajlarını tutmak için state
    const [error, setError] = useState('');

    // Tarama işlemi başarılı olduğunda çalışacak fonksiyon
    const handleScan = (data) => {
        if (data) {
            // Tarama başarılı, state'i sıfırla ve sonucu yönlendir
            setIsScanning(false);
            setError('');
            // Barkod numarasını alıp 'result' sayfasına yönlendir
            navigate(`/result/${data.text}`);
        }
    };

    // Tarama sırasında hata oluşursa çalışacak fonksiyon
    const handleError = (err) => {
        console.error(err);
        setError('Kamera açılamadı veya bir hata oluştu. Lütfen izinleri kontrol edin.');
    };

    const startScan = () => {
        setIsScanning(true);
        setError(''); // Hata varsa temizle
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
                gap: 3 // Bileşenler arasına boşluk ekledik
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'white',
                    width: '100%',
                    maxWidth: 400, // Biraz daha genişlettik
                    // Tarayıcı çerçevesi efekti
                    border: '4px solid',
                    borderColor: isScanning ? 'error.main' : 'primary.main', // Taramadayken farklı renk
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Stack spacing={2} alignItems="center">

                    {/* Tarayıcı Alanı */}
                    {isScanning ? (
                        <Box sx={{ width: '100%', height: 300, overflow: 'hidden', borderRadius: 2 }}>
                            {/* QrReader Bileşeni */}
                            <QrReader
                                onResult={(result, error) => {
                                    if (!!result) {
                                        handleScan(result);
                                    }

                                    if (!!error && error.name !== "NotFoundError") {
                                        handleError(error);
                                    }
                                }}
                                style={{ width: '100%' }}
                                constraints={{ facingMode: "environment" }} // Arka kamerayı kullanmayı tercih et
                                containerStyle={{ paddingTop: '0' }} // Varsayılan padding'i kaldır
                            />
                            <CircularProgress sx={{ mt: 2 }} />
                        </Box>
                    ) : (
                        // Tarayıcı kapalıyken gösterilecek ikon deneme1
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

            {/* Simülasyon butonu sadece test için kalsın */}
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