import { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

type Game = {
  id?: number
  slug: string
  title: string
  platform?: string
  media_format?: string
  is_board_game?: boolean
  release_date?: string | null
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const { t, i18n } = useTranslation()
  const [games, setGames] = useState<Game[]>([])
  const [form, setForm] = useState<Game>({ slug: '', title: '' })
  const [query, setQuery] = useState('zelda')
  const [results, setResults] = useState<any[]>([])

  const load = async () => {
    const { data } = await axios.get(`${API_BASE}/games`)
    setGames(data)
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    const { data } = await axios.post(`${API_BASE}/games`, form)
    setForm({ slug: '', title: '' })
    setGames([data, ...games])
  }
  const del = async (id?: number) => {
    if (!id) return
    await axios.delete(`${API_BASE}/games/${id}`)
    setGames(games.filter(g => g.id !== id))
  }
  const search = async () => {
    const { data } = await axios.get(`${API_BASE}/providers/search`, { params: { q: query } })
    setResults(data.results)
  }

  return (
    <div className="container">
      <div className="lang">
        <button onClick={() => i18n.changeLanguage('pt')}>{t('lang_pt')}</button>
        <button onClick={() => i18n.changeLanguage('en')}>{t('lang_en')}</button>
      </div>
      <h1>{t('title')}</h1>

      <div className="card">
        <div className="row">
          <input placeholder={t('title_label') as string} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          <input placeholder={t('platform_label') as string} value={form.platform || ''} onChange={e => setForm({ ...form, platform: e.target.value })} />
          <label><input type="checkbox" checked={form.is_board_game || false} onChange={e => setForm({ ...form, is_board_game: e.target.checked })} /> {t('board_game')}</label>
          <input type="date" onChange={e => setForm({ ...form, release_date: e.target.value })} />
          <button onClick={add}>{t('save')}</button>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search_providers') as string} />
          <button onClick={search}>{t('search_providers')}</button>
        </div>
        <div>
          {results.map((r, idx) => (
            <div key={idx} className="row" style={{ justifyContent: 'space-between' }}>
              <div>
                <b>{r.title}</b> <span className="badge">{r.source}</span> {r.release_date ? `– ${r.release_date}` : ''}
              </div>
              <button onClick={() => setForm({
                slug: r.slug,
                title: r.title,
                platform: (r.platforms && r.platforms[0]) || ''
              })}>{t('add_game')}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{t('upcoming')}</h3>
        <table>
          <thead><tr><th>{t('title_label')}</th><th>{t('release_date')}</th><th></th></tr></thead>
          <tbody>
          {games.filter(g => g.release_date).sort((a,b) => (a.release_date || '').localeCompare(b.release_date || '')).map(g => (
            <tr key={g.id}>
              <td>{g.title}</td>
              <td>{g.release_date}</td>
              <td><button onClick={() => del(g.id)}>{t('delete')}</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <table>
          <thead><tr><th>ID</th><th>Slug</th><th>{t('title_label')}</th><th>{t('platform_label')}</th><th></th></tr></thead>
          <tbody>
          {games.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.slug}</td>
              <td>{g.title}</td>
              <td>{g.platform}</td>
              <td><button onClick={() => del(g.id)}>{t('delete')}</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
