import React, { useState } from 'react';
import { Typography, Box, Button, Paper, Stack, CircularProgress } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useZxing } from 'react-zxing';

const Scan = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');

    const { ref } = useZxing({
        onResult(result) {
            if (result?.getText()) {
                setIsScanning(false);
                setError('');
                navigate(`/result/${result.getText()}`);
            }
        },
        onError(err) {
            console.error(err);
            setError('Kamera açılamadı veya bir hata oluştu. Lütfen izinleri kontrol edin.');
            setIsScanning(false);
        },
        constraints: { facingMode: 'environment' }, // Arka kamerayı kullan
    });

    const startScan = () => {
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
                    {isScanning ? (
                        <Box sx={{ width: '100%', height: 300, overflow: 'hidden', borderRadius: 2, position: 'relative' }}>
                            <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />
                        </Box>
                    ) : (
                        <QrCodeScannerIcon
                            sx={{
                                fontSize: 100,
                                color: 'primary.dark',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        />
                    )}

                    <Typography variant="h5" component="h1" fontWeight="bold" color="primary.main" gutterBottom>
                        {isScanning ? 'Tarama Başlatıldı...' : 'Ürün Tarama Alanı'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {isScanning
                            ? 'Barkodu veya QR kodu kamera alanına ortalayın.'
                            : 'Alerji kontrolü için barkodu taramak üzere butona basın.'}
                    </Typography>

                    {error && <Typography variant="body2" color="error">{error}</Typography>}
                </Stack>
            </Paper>

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
