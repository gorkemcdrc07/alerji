import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// MUI Temel Bileşenleri ve Düzen
import {
    Container,
    CssBaseline,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
    Box
} from '@mui/material';

// MUI İkonları (Lütfen @mui/icons-material paketini kurduğunuzdan emin olun!)
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Sayfa importları
import Login from './pages/Login';
import Allergies from './pages/Allergies';
import Profile from './pages/Profile';
import Result from './pages/Result';
import Scan from './pages/Scan';

// Context ve Yardımcılar
import { useAuth } from './contexts/AuthContext';
import { Link } from 'react-router-dom'; // Router linkleri için

// ----------------------------------------------------------------------
// MOBİL ALT NAVİGASYON BİLEŞENİ
// ----------------------------------------------------------------------
const BottomNav = () => {
    const location = useLocation();

    // Alt navigasyonun hangi sayfayı vurgulayacağını belirler.
    const getPathValue = (path) => {
        // Sonuç sayfası ve diğer rotalar da scan'e yönlendirilebilir.
        if (path.startsWith('/allergies')) return '/allergies';
        if (path.startsWith('/profile')) return '/profile';
        // Varsayılan olarak Scan sayfasını vurgula (/, /scan, /result/:barkod)
        return '/scan';
    };

    // Mevcut yolu izler
    const [value, setValue] = React.useState(getPathValue(location.pathname));

    React.useEffect(() => {
        // Tarayıcı URL'si değiştiğinde değeri güncelle
        setValue(getPathValue(location.pathname));
    }, [location.pathname]);

    return (
        // Paper: Sayfaya yapışık alt kısım
        <Paper sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: 'sm',
            margin: '0 auto',
            zIndex: 100 // Diğer içeriklerin üstünde kalmasını sağlar
        }} elevation={5}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    // Navigate linkleri kullanıldığı için bu aslında sadece görsel durumu günceller
                    setValue(newValue);
                }}
            >
                {/* Her bir navigasyon öğesi, react-router-dom Link bileşeni ile sarmalanmıştır */}
                <BottomNavigationAction component={Link} to="/scan" label="Tara" value="/scan" icon={<QrCodeScannerIcon />} />
                <BottomNavigationAction component={Link} to="/allergies" label="Alerjilerim" value="/allergies" icon={<FavoriteIcon />} />
                <BottomNavigationAction component={Link} to="/profile" label="Profil" value="/profile" icon={<AccountCircleIcon />} />
            </BottomNavigation>
        </Paper>
    );
};
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// ANA DÜZEN (LAYOUT) BİLEŞENİ
// ----------------------------------------------------------------------
const MainLayout = ({ children }) => (
    <Container
        component="main"
        maxWidth="sm"
        sx={{
            // Container'ın etrafındaki varsayılan padding'i kaldırıyoruz
            p: 0,
            minHeight: '100vh',
            bgcolor: '#f5f5f5', // Arka plan rengi
            position: 'relative',
            // Alt navigasyonun kapladığı alan kadar boşluk bırakıyoruz
            pb: '56px'
        }}
    >
        <CssBaseline />
        {/* İçerik Kutusu: Sayfa içeriği burada yer alacak */}
        <Box sx={{ p: 2, height: '100%' }}>
            {children}
        </Box>
        {/* Alt Navigasyon Çubuğu */}
        <BottomNav />
    </Container>
);
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// KORUMALI ROTA (PROTECTED ROUTE) BİLEŞENİ
// ----------------------------------------------------------------------
const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // Yüklenme sırasında bir şey gösterme (AuthContext zaten bir "Yükleniyor..." gösteriyor)
    if (loading) return null;

    // Eğer kullanıcı oturum açmışsa MainLayout'u göster, yoksa Login sayfasına yönlendir
    return user ? <MainLayout><Outlet /></MainLayout> : <Navigate to="/login" replace />;
};


// ----------------------------------------------------------------------
// APP FONKSİYONU (ANA ROTACI)
// ----------------------------------------------------------------------
function App() {
    return (
        <Routes>

            {/* 1. Kimlik Doğrulama Sayfaları */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />

            {/* 2. Korumalı Sayfalar (Protected Rota ile sarmalanır) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Scan />} /> // Varsayılan anasayfa
                <Route path="/scan" element={<Scan />} />
                <Route path="/allergies" element={<Allergies />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/result/:barkod" element={<Result />} />
            </Route>

            {/* 3. Yanlış URL'ler için Yönlendirme */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}

export default App;