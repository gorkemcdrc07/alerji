import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Typography,
    Box,
    Button,
    Paper,
    Stack,
    Divider
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Profile = () => {
    // Auth Context'ten kullanıcı bilgisini ve çıkış yapma fonksiyonunu alıyoruz
    const { user, signOut } = useAuth();

    // Kullanıcı bilgileri henüz yüklenmediyse (nadiren olur) veya yoksa
    if (!user) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Oturum bilgisi bulunamadı.</Typography>
            </Box>
        );
    }

    // Çıkış Yapma işlemi
    const handleSignOut = async () => {
        try {
            // Supabase'den çıkış yap
            await signOut();
            // AuthContext otomatik olarak Login sayfasına yönlendirecektir.
        } catch (error) {
            console.error('Çıkış yapma hatası:', error.message);
            alert('Çıkış yapılırken bir sorun oluştu.'); // Hata durumunda bilgilendirme
        }
    };

    return (
        <Box sx={{ pt: 2, pb: 2 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, textAlign: 'center' }}>

                <AccountCircleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />

                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Hesap Bilgileri
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1} alignItems="flex-start" sx={{ width: '100%' }}>

                    <Box sx={{ width: '100%', textAlign: 'left' }}>
                        <Typography variant="body2" color="text.secondary">
                            Kullanıcı E-postası
                        </Typography>
                        <Typography variant="h6" fontWeight="medium" sx={{ wordBreak: 'break-all' }}>
                            {user.email}
                        </Typography>
                    </Box>

                    <Box sx={{ width: '100%', textAlign: 'left', pt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Kullanıcı Kimliği (UID)
                        </Typography>
                        <Typography variant="body2" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
                            {user.id}
                        </Typography>
                    </Box>

                </Stack>

            </Paper>

            <Button
                variant="outlined"
                color="error"
                fullWidth
                size="large"
                onClick={handleSignOut}
                startIcon={<ExitToAppIcon />}
                sx={{ height: 50, borderRadius: 3 }}
            >
                Çıkış Yap
            </Button>

        </Box>
    );
};

export default Profile;
