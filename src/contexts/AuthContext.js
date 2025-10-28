import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Supabase oturumunu kontrol et ve ayarla
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);

        // Oturum de�i�ikliklerini dinle
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        // Temizleme: Dinleyiciyi durdur
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Kullan�lacak de�erler ve Supabase Auth fonksiyonlar�
    const value = {
        user,
        loading,
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
    };

    // Y�klenme durumunda basit bir ekran
    if (loading) {
        // MUI CircularProgress eklenebilir. �imdilik d�z metin.
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Oturum Kontrol Ediliyor...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};