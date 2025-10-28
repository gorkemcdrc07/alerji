import React from 'react';
import { Typography, Box, Button, Paper, Stack } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router-dom';

const Scan = () => {
    const navigate = useNavigate();

    // Kamera entegrasyonu daha sonra yapılacak. Şimdilik simülasyon butonu:
    const simulateScan = () => {
        // Test için örnek bir barkod numarası
        const dummyBarcode = '869000000001';
        navigate(`/result/${dummyBarcode}`);
    };

    return (
        // İçeriği dikey ortalamak için Box kullanıyoruz
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Dikeyde ortala
                alignItems: 'center',
                textAlign: 'center',
                p: 3
            }}
        >
            <Paper
                elevation={6} // Yüksek gölge ile dikkat çekme
                sx={{
                    p: 4,
                    borderRadius: 4, // Daha yuvarlak köşeler
                    bgcolor: 'white',
                    width: '100%',
                    maxWidth: 350,
                    mb: 4,
                    // Tarayıcı çerçevesi efekti
                    border: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <QrCodeScannerIcon
                        sx={{
                            fontSize: 100, // İkonu büyüt
                            color: 'primary.dark',
                            // Hafif animasyon efekti
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                    <Typography
                        variant="h5"
                        component="h1"
                        fontWeight="bold"
                        color="primary.main"
                        gutterBottom
                    >
                        Ürün Tarama Alanı
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Alerji kontrolü için barkodu ortalamak üzere kamerayı açmak için aşağıdaki butona basın.
                    </Typography>
                </Stack>
            </Paper>

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={simulateScan}
                sx={{
                    width: '100%',
                    maxWidth: 350,
                    height: 55,
                    borderRadius: 3, // Buton yuvarlaklığını artır
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)' // Hafif renkli gölge
                }}
            >
                Tarama Başlat (Şimdilik Simülasyon)
            </Button>

        </Box>
    );
};

export default Scan;
