import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import {
    Typography,
    Chip,
    Box,
    CircularProgress,
    Alert,
    Stack,
    Button,
    Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';

// Tablo İsimleri (Türkçe adlandırmayı kullanıyoruz!)
const ALERJENLER_TABLOSU = 'alerjenler';
const KULLANICI_ALERJILERI_TABLOSU = 'kullanici_alerjileri';

const Allergies = () => {
    const { user } = useAuth();

    // Tüm olası alerjenleri tutar
    const [tumAlerjenler, setTumAlerjenler] = useState([]);

    // Kullanıcının seçtiği alerjen ID'lerini Set yapısında tutar
    const [seciliAlerjenIdleri, setSeciliAlerjenIdleri] = useState(new Set());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // ----------------------------------------------------
    // Veri Çekme Fonksiyonu
    // ----------------------------------------------------
    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            // A. Tüm Alerjenleri Çek
            const { data: alerjenData, error: alerjenError } = await supabase
                .from(ALERJENLER_TABLOSU)
                .select('id, ad')
                .order('ad', { ascending: true });

            if (alerjenError) throw alerjenError;
            setTumAlerjenler(alerjenData);

            // B. Kullanıcının Mevcut Alerjilerini Çek
            const { data: kullaniciAlerjiData, error: kullaniciAlerjiError } = await supabase
                .from(KULLANICI_ALERJILERI_TABLOSU)
                .select('alerjen_id')
                .eq('kullanici_id', user.id);

            if (kullaniciAlerjiError) throw kullaniciAlerjiError;

            const currentIds = new Set(kullaniciAlerjiData.map(item => item.alerjen_id));
            setSeciliAlerjenIdleri(currentIds);

        } catch (err) {
            console.error("Veri çekme hatası:", err);
            setError("Alerji listeleri yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // ----------------------------------------------------
    // Chip Tıklama Olayı (Ekle/Kaldır)
    // ----------------------------------------------------
    const handleChipClick = (id) => {
        if (isSaving) return;

        setSeciliAlerjenIdleri(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(id)) {
                newIds.delete(id);
            } else {
                newIds.add(id);
            }
            setSuccess(false); // Değişiklik yapıldığı için başarı mesajını sıfırla
            return newIds;
        });
    };


    // ----------------------------------------------------
    // Kaydetme İşlemi (Supabase'e Yazma)
    // ----------------------------------------------------
    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setSuccess(false);
        setError(null);

        try {
            // 1. Mevcut tüm alerjileri sil (Tekrar ekleme/silme karmaşasını önler)
            const { error: deleteError } = await supabase
                .from(KULLANICI_ALERJILERI_TABLOSU)
                .delete()
                .eq('kullanici_id', user.id);

            if (deleteError) throw deleteError;

            // 2. Yeni seçilen alerjileri hazırla
            const yeniAlerjiler = Array.from(seciliAlerjenIdleri).map(alerjen_id => ({
                kullanici_id: user.id,
                alerjen_id: alerjen_id
            }));

            // 3. Toplu ekleme yap
            if (yeniAlerjiler.length > 0) {
                const { error: insertError } = await supabase
                    .from(KULLANICI_ALERJILERI_TABLOSU)
                    .insert(yeniAlerjiler);

                if (insertError) throw insertError;
            }

            setSuccess(true);
            // Başarılı kaydetme sonrası verileri tekrar çekmeye gerek yok, state güncel.

        } catch (err) {
            console.error("Kaydetme hatası:", err);
            setError("Alerji listesi kaydedilirken bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };


    // ----------------------------------------------------
    // Render (Arayüz Çizimi)
    // ----------------------------------------------------
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" component="h1" fontWeight="bold" color="primary.main" gutterBottom>
                    Alerjen Seçim Alanı
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Size alerji yapan maddeleri işaretleyip **Kaydet** butonuna basınız. Seçtikleriniz ürün taraması sırasında sizi uyaracaktır.
                </Typography>
            </Paper>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Alerjileriniz başarıyla kaydedildi!</Alert>}

                <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap>
                    {tumAlerjenler.map(alerjen => {
                        const isSelected = seciliAlerjenIdleri.has(alerjen.id);
                        return (
                            <Chip
                                key={alerjen.id}
                                label={alerjen.ad}
                                clickable
                                onClick={() => handleChipClick(alerjen.id)}
                                color={isSelected ? "error" : "default"} // Alerji = Kırmızı Aksan
                                variant={isSelected ? "filled" : "outlined"}
                                icon={isSelected ? <CheckCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                                disabled={isSaving}
                                sx={{
                                    fontWeight: isSelected ? 'bold' : 'normal',
                                    transition: 'all 0.2s',
                                    '&:active': { transform: 'scale(0.98)' }
                                }}
                            />
                        );
                    })}
                </Stack>
            </Box>

            {/* Kaydetme Butonu, sayfanın altına sabitlenmiş gibi görünecek */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleSave}
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ height: 55, borderRadius: 3 }}
                >
                    {isSaving ? "Kaydediliyor..." : "Alerjileri Kaydet"}
                </Button>
            </Box>

        </Box>
    );
};

export default Allergies;
