import { Component } from 'react'
import { useLocale } from '../i18n/store'

function pick(en, ru, uk) {
  const lang = useLocale.getState().lang
  if (lang === 'ru' && ru) return ru
  if (lang === 'uk' && uk) return uk
  return en
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Page error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-text-body p-8">
          <div className="max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="font-display text-xl text-white mb-3">
              {pick('Something went wrong', 'Что-то пошло не так', 'Щось пішло не так')}
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              {this.state.error?.message || pick('Unknown error', 'Неизвестная ошибка', 'Невідома помилка')}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="px-6 py-3 bg-qa-teal text-black font-mono text-[12px] tracking-wider uppercase cursor-pointer hover:bg-qa-teal-soft transition-colors"
            >
              {pick('Reload', 'Перезагрузить', 'Перезавантажити')}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
