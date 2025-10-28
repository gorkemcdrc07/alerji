import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Link,
    CircularProgress // Yüklenme animasyonu için
} from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate('/', { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;

            if (isSigningUp) {
                response = await signUp({ email, password });
            } else {
                response = await signIn({ email, password });
            }

            if (response.error) {
                // Supabase Auth hatalarını yakala
                throw response.error;
            }

        } catch (err) {
            // Hata mesajını Supabase'den veya genel hata mesajından al
            setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'white'
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    {isSigningUp ? 'Yeni Hesap Oluştur' : 'Giriş Yap'}
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>

                    <TextField
                        margin="normal" required fullWidth label="E-Posta Adresi" name="email"
                        autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <TextField
                        margin="normal" required fullWidth name="password" label="Şifre"
                        type="password" autoComplete="current-password" value={password}
                        onChange={(e) => setPassword(e.target.value)} disabled={loading}
                    />

                    <Button
                        type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, height: 50 }}
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            isSigningUp ? 'Kayıt Ol' : 'Giriş Yap'
                        )}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Link
                            href="#"
                            variant="body2"
                            onClick={(e) => { e.preventDefault(); setIsSigningUp(!isSigningUp); setError(''); }}
                        >
                            {isSigningUp ? 'Zaten hesabınız var mı? Giriş Yapın.' : 'Hesabınız yok mu? Hemen Kayıt Olun.'}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;