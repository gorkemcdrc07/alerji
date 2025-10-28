import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import {
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Tablo İsimleri (Türkçe adlandırmayı kullanıyoruz!)
const KULLANICI_ALERJILERI_TABLOSU = 'kullanici_alerjileri';

// Geçici Ürün Veri Yapısı (Gerçek API'dan gelmesi bekleniyor)
// NOT: Gerçek veride alerjen listesi Open Food Facts'ten gelmelidir.
const initialProductState = {
    name: null,
    barcode: null,
    ingredients: [],
    // Bu alerjenler kullanıcının alerjileriyle ÇATIŞAN alerjenler olacak
    conflicting_allergens: []
};

const Result = () => {
    const { barkod } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(initialProductState);
    const [userAlerjileri, setUserAlerjileri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----------------------------------------------------
    // 1. Kullanıcının Alerjilerini Çekme
    // ----------------------------------------------------
    const fetchUserAllergies = useCallback(async () => {
        if (!user) return;

        // Alerjen ID'lerini ve adlarını join ile çekiyoruz
        const { data, error } = await supabase
            .from(KULLANICI_ALERJILERI_TABLOSU)
            .select(`
                alerjen_id,
                alerjenler (ad)
            `)
            .eq('kullanici_id', user.id);

        if (error) throw error;

        // Sadece alerjen adlarını alıyoruz
        const alerjiAdlari = data.map(item => item.alerjenler.ad);
        setUserAlerjileri(alerjiAdlari);
        return alerjiAdlari;

    }, [user]);

    // ----------------------------------------------------
    // 2. Ürün Bilgisini Çekme ve Alerji Kontrolü
    // ----------------------------------------------------
    const fetchProductAndCheckAllergies = useCallback(async (alerjiAdlari) => {
        if (!barkod) {
            setError("Barkod bulunamadı.");
            setLoading(false);
            return;
        }

        try {
            // Edge Function'ı çağırıyoruz. Edge Function, Open Food Facts'e bağlanacak.
            const response = await supabase.functions.invoke('check-allergens', {
                body: { barcode: barkod, userAllergies: alerjiAdlari },
            });

            if (response.error) throw response.error;

            const result = response.data;

            // Edge Function'dan gelen sonucu state'e aktar
            setProduct({
                name: result.product_name,
                barcode: barkod,
                ingredients: result.ingredients.split(', '),
                conflicting_allergens: result.conflicting_allergens,
            });

        } catch (err) {
            console.error("Ürün çekme/kontrol hatası:", err);
            setError("Ürün bilgisi alınamadı veya sunucu hatası oluştu.");

            // Hata durumunda geçici (dummy) bir veri gösterelim
            setProduct({
                name: "Örnek Ürün - HATA",
                barcode: barkod,
                ingredients: ["Su", "Şeker", "Fıstık Ezmesi (Alerjen!)"],
                conflicting_allergens: ["Fıstık"],
            });
        } finally {
            setLoading(false);
        }
    }, [barkod]);

    // ----------------------------------------------------
    // useEffect: Veri Akışı
    // ----------------------------------------------------
    useEffect(() => {
        // Her iki işlemi de birleştiriyoruz
        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                const allergies = await fetchUserAllergies();
                await fetchProductAndCheckAllergies(allergies);
            } catch (err) {
                setError("Veri yüklenirken kritik bir hata oluştu.");
                setLoading(false);
            }
        }
        loadData();
    }, [fetchUserAllergies, fetchProductAndCheckAllergies]);

    // ----------------------------------------------------
    // Render (Arayüz Çizimi)
    // ----------------------------------------------------

    const hasConflict = product.conflicting_allergens.length > 0;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 2 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/scan')}
                sx={{ mb: 2 }}
            >
                Yeni Tarama Yap
            </Button>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Durum Kartı (Uyarı veya Güvenli) */}
            <Paper
                elevation={hasConflict ? 6 : 4}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    textAlign: 'center',
                    bgcolor: hasConflict ? '#ffebee' : '#e8f5e9', // Kırmızı veya Yeşil arka plan
                    color: hasConflict ? 'error.main' : 'success.main',
                    border: `2px solid ${hasConflict ? 'red' : 'green'}`
                }}
            >
                {hasConflict ? (
                    <WarningIcon sx={{ fontSize: 60, mb: 1 }} />
                ) : (
                    <CheckCircleIcon sx={{ fontSize: 60, mb: 1 }} />
                )}
                <Typography variant="h4" fontWeight="bold">
                    {hasConflict ? "RİSK VAR!" : "GÜVENLİ"}
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                    {product.name}
                </Typography>
            </Paper>

            {/* Alerji Çatışmaları Detayı */}
            {hasConflict && (
                <Alert severity="error" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Bu ürün, belirlediğiniz alerjenlerden
                    <List dense>
                        {product.conflicting_allergens.map((alerjen, index) => (
                            <ListItem key={index} sx={{ py: 0.1 }}>
                                <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
                                <ListItemText primary={alerjen} />
                            </ListItem>
                        ))}
                    </List>
                    içermektedir. Lütfen dikkatli olunuz.
                </Alert>
            )}

            {/* Ürün Detayları */}
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    <FastfoodIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Ürün İçeriği
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" fontWeight="bold">
                    Barkod Numarası: {barkod}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    **Tüm İçindekiler:** {product.ingredients.join(', ')}
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                        Sizin Kayıtlı Alerjileriniz:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {userAlerjileri.length > 0 ? userAlerjileri.join(', ') : 'Hiç alerjen kaydetmediniz.'}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Result;
