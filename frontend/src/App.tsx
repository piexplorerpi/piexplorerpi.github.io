import React, { Component, ErrorInfo, ReactNode } from 'react';
import AppRouter from './Router';
import { I18nProvider } from './i18n/I18nContext';
import { ErrorView } from './components/shared/ErrorView';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Uncaught Error:', error, errorInfo);
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      // استفاده از کامپوننت جدید برای نمایش خطا
      return <ErrorView onReload={this.handleReload} />;
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    // پوشاندن کل برنامه با I18nProvider
    <I18nProvider>
      <ErrorBoundary>
        <div className="app-container">
          {React.createElement(AppRouter as any)}
        </div>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default App;
