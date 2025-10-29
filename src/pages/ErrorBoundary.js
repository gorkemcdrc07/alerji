import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
        if (this.props.onError) this.props.onError(error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div>
                    <p>Bir hata oluştu: {String(this.state.error)}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
