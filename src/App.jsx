import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

const inisial = (n = '') => n.split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase()

const Btn = ({ className = '', ...p }) => (
  <button className={'inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40 ' + className} {...p} />
)
const Ghost = ({ className = '', ...p }) => (
  <button className={'rounded-xl border border-line bg-white px-5 py-3 font-semibold transition hover:bg-slate-50 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40 ' + className} {...p} />
)
const Card = ({ children, className = '' }) => <div className={'rounded-2xl border border-line bg-white p-5 shadow-sm ' + className}>{children}</div>
const Field = ({ label, ...p }) => (
  <label className="block text-sm font-semibold">{label}
    <input className="mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-3 font-normal outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15" {...p} />
  </label>
)
const Avatar = ({ nama, className = '' }) => (
  <span className={'grid shrink-0 place-items-center rounded-full bg-gold font-bold text-brand-dark ' + className}>{inisial(nama)}</span>
)
const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
)

function Header({ siswa, onKeluar }) {
  const keluar = () => { if (window.confirm('Yakin ingin keluar?')) onKeluar() }
  return (
    <header className="sticky top-0 z-10 bg-brand-dark text-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-2.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white">
          <img src="/logo.png" alt="Logo SMAIT Alia Tangerang" className="h-9" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block truncate tracking-wide">APTITUDE TEST</b>
          <span className="block truncate text-xs tracking-wider text-gold">SMAIT ALIA TANGERANG</span>
        </div>
        {siswa && (
          <>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-semibold">{siswa.nama}</div>
              <div className="text-xs text-white/70">Kelas {siswa.kelas}</div>
            </div>
            <Avatar nama={siswa.nama} className="h-9 w-9 text-sm" />
            <button onClick={keluar} title="Keluar" className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-2 text-sm font-medium transition hover:bg-white hover:text-brand-dark">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </>
        )}
      </div>
      <div className="h-1 bg-gold" />
    </header>
  )
}

function Login() {
  const masuk = () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card className="p-8 text-center">
        <img src="/logo.png" alt="" className="mx-auto h-24" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Selamat datang</h1>
        <p className="mt-1.5 text-sm text-slate-600">Masuk dengan akun Google untuk mengerjakan tes bakat.</p>
        <button onClick={masuk} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 py-3 font-semibold shadow-sm transition hover:bg-slate-50 hover:shadow active:scale-[.98]">
          <GoogleG /> Masuk dengan Google
        </button>
        <p className="mt-5 text-xs text-slate-500">Pertama kali masuk, kamu diminta mengisi NIS dan NISN untuk verifikasi.</p>
      </Card>
    </div>
  )
}

function Verifikasi({ onSelesai }) {
  const [nis, setNis] = useState(''), [nisn, setNisn] = useState('')
  const [calon, setCalon] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const cek = async () => {
    setErr(''); setBusy(true)
    const { data, error } = await supabase.rpc('cek_siswa', { p_nis: nis, p_nisn: nisn })
    setBusy(false)
    if (error?.message?.includes('terlalu_banyak')) setErr('Terlalu banyak percobaan yang salah. Tunggu 15 menit lalu coba lagi, atau hubungi guru.')
    else if (data?.length) setCalon(data[0])
    else setErr('NIS dan NISN tidak cocok, atau sudah dipakai akun lain. Hubungi guru jika kamu yakin datanya benar.')
  }
  const tautkan = async () => {
    setBusy(true)
    const { data } = await supabase.rpc('tautkan_siswa', { p_nis: nis, p_nisn: nisn })
    setBusy(false)
    data ? onSelesai() : setErr('Gagal menautkan akun. Hubungi guru.')
  }
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-7">
        {!calon ? (
          <>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">Langkah 1 dari 2</span>
            <h1 className="mt-3 text-xl font-bold">Verifikasi siswa</h1>
            <p className="mb-5 mt-1 text-sm text-slate-600">Cukup diisi sekali. NISN tertera di kartu NISN kamu.</p>
            <div className="space-y-4">
              <Field label="NIS" value={nis} onChange={(e) => setNis(e.target.value)} inputMode="numeric" placeholder="Contoh: 252610001" />
              <Field label="NISN" value={nisn} onChange={(e) => setNisn(e.target.value)} inputMode="numeric" placeholder="10 digit" />
            </div>
            {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}
            <Btn onClick={cek} disabled={busy || !nis || !nisn} className="mt-5 w-full">{busy ? 'Memeriksa...' : 'Periksa'}</Btn>
          </>
        ) : (
          <>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">Langkah 2 dari 2</span>
            <p className="mt-3 text-sm text-slate-600">Apakah ini kamu?</p>
            <div className="my-4 flex items-center gap-4 rounded-xl bg-[#f7f4fa] p-4">
              <Avatar nama={calon.nama} className="h-14 w-14 text-lg" />
              <div><h2 className="text-lg font-bold leading-tight">{calon.nama}</h2><p className="text-sm text-slate-600">Kelas {calon.kelas}</p></div>
            </div>
            {err && <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}
            <div className="flex gap-3">
              <Btn onClick={tautkan} disabled={busy} className="flex-1">Ya, ini saya</Btn>
              <Ghost onClick={() => { setCalon(null); setErr('') }}>Bukan</Ghost>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

function Tes({ tes, onKembali }) {
  const [d, setD] = useState(null), [i, setI] = useState(0), [sisa, setSisa] = useState(0)
  const [hasil, setHasil] = useState(null), [err, setErr] = useState(''), [, tick] = useState(0)
  const jw = useRef({}), akhir = useRef(0), terkirim = useRef(false)
  const kirim = async () => {
    if (terkirim.current) return
    terkirim.current = true
    const { data, error } = await supabase.rpc('kirim_jawaban', { p_tes: tes.id, p_jawaban: jw.current })
    error ? setErr('Jawaban gagal dikirim. Hubungi guru.') : setHasil(data)
  }
  useEffect(() => {
    supabase.rpc('mulai_tes', { p_tes: tes.id }).then(({ data, error }) => {
      if (error) return setErr('Tes tidak bisa dimulai. Mungkin sudah pernah dikerjakan.')
      jw.current = data.jawaban || {}; akhir.current = Date.now() + data.sisa_detik * 1000
      setD(data); setSisa(data.sisa_detik)
    })
  }, [tes.id])
  useEffect(() => {
    if (!d || hasil) return
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((akhir.current - Date.now()) / 1000))
      setSisa(s); if (s <= 0) { clearInterval(t); kirim() }
    }, 1000)
    return () => clearInterval(t)
  }, [d, hasil])
  const pilih = (n, j) => {
    jw.current = { ...jw.current, [n]: j }; tick((x) => x + 1)
    supabase.rpc('kirim_jawaban', { p_tes: tes.id, p_jawaban: jw.current, p_final: false })
  }
  const Tengah = ({ children }) => <div className="mx-auto max-w-xl px-4 py-10"><Card className="p-7 text-center">{children}</Card></div>
  if (err) return <Tengah><p className="text-red-800">{err}</p><Btn className="mt-4" onClick={onKembali}>Kembali</Btn></Tengah>
  if (hasil) return (
    <Tengah>
      <p className="text-sm font-semibold text-brand">{tes.nama} selesai</p>
      <div className="my-3 text-6xl font-bold text-brand-dark">{hasil.skor}</div>
      <p className="text-slate-600">Benar {hasil.benar} dari {hasil.total} soal</p>
      <Btn onClick={onKembali} className="mt-6 w-full">Kembali ke daftar tes</Btn>
    </Tengah>
  )
  if (!d) return <p className="p-10 text-center text-slate-500">Memuat soal...</p>
  const q = d.soal[i], n = d.soal.length, huruf = 'ABCDE'
  return (
    <div className="mx-auto max-w-xl px-4 py-5">
      <div className="flex items-center justify-between">
        <div><p className="font-bold leading-tight">{tes.nama}</p><p className="text-sm text-slate-600">Soal {i + 1} dari {n}</p></div>
        <span className={'rounded-full px-4 py-1.5 text-lg font-bold tabular-nums ' + (sisa <= 60 ? 'bg-red-100 text-red-800' : 'bg-brand/10 text-brand-dark')}>
          {Math.floor(sisa / 60)}:{String(sisa % 60).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {d.soal.map((s, k) => (
          <button key={s.nomor} onClick={() => setI(k)} aria-label={'Soal ' + (k + 1)}
            className={'h-8 w-8 rounded-lg text-sm font-semibold transition ' + (k === i ? 'ring-2 ring-gold ring-offset-1 ' : '') + (jw.current[s.nomor] !== undefined ? 'bg-brand text-white' : 'border border-line bg-white')}>{k + 1}</button>
        ))}
      </div>
      <Card className="mt-4">
        <p className="mb-4 text-lg leading-relaxed">{q.q}</p>
        {q.g && <img src={'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(q.g)} alt="Gambar soal" className="mx-auto mb-4 max-h-64 w-full object-contain" />}
        <div className="space-y-2.5">
          {q.o.map((o, j) => {
            const on = jw.current[q.nomor] === j
            return (
              <button key={j} onClick={() => pilih(q.nomor, j)}
                className={'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition active:scale-[.99] ' + (on ? 'border-brand bg-brand/10 ring-2 ring-brand' : 'border-line bg-white hover:border-brand/50')}>
                <span className={'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ' + (on ? 'bg-brand text-white' : 'bg-slate-100')}>{huruf[j]}</span>
                <span>{o}</span>
              </button>
            )
          })}
        </div>
      </Card>
      <div className="mt-4 flex justify-between gap-3">
        <Ghost disabled={!i} onClick={() => setI(i - 1)}>Sebelumnya</Ghost>
        {i < n - 1 ? <Btn onClick={() => setI(i + 1)}>Berikutnya</Btn>
          : <Btn onClick={() => Object.keys(jw.current).length < n ? alert('Masih ada soal yang belum dijawab.') : kirim()}>Selesaikan tes</Btn>}
      </div>
    </div>
  )
}

function Beranda({ siswa, onMulai }) {
  const [tes, setTes] = useState(null)
  useEffect(() => { supabase.rpc('daftar_tes').then(({ data }) => setTes(data || [])) }, [])
  const done = (t) => t.status === 'selesai' || t.status === 'waktu_habis'
  const selesai = tes?.filter(done).length || 0, total = tes?.length || 0
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-sm">
        <Avatar nama={siswa.nama} className="h-14 w-14 text-lg" />
        <div>
          <p className="text-sm text-white/70">Selamat mengerjakan</p>
          <h1 className="text-xl font-bold leading-tight">{siswa.nama}</h1>
          <p className="text-sm text-white/80">Kelas {siswa.kelas}</p>
        </div>
      </div>
      <div className="mt-6 flex items-end justify-between">
        <h2 className="text-lg font-bold">Daftar tes</h2>
        <span className="text-sm text-slate-600">{selesai} dari {total} selesai</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-brand transition-all" style={{ width: (total ? (selesai / total) * 100 : 0) + '%' }} /></div>
      <p className="mt-2 text-xs text-slate-500">Waktu tiap tes mulai berjalan saat kamu menekan Mulai dan tidak bisa dijeda.</p>
      {tes === null && <p className="mt-6 text-slate-500">Memuat...</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tes?.map((t, k) => (
          <Card key={t.id} className="flex items-center gap-4 !p-4">
            <span className={'grid h-11 w-11 shrink-0 place-items-center rounded-xl font-bold ' + (done(t) ? 'bg-emerald-100 text-emerald-800' : 'bg-brand/10 text-brand')}>{done(t) ? '✓' : k + 1}</span>
            <div className="min-w-0 flex-1">
              <b className="block leading-tight">{t.nama}</b>
              <p className="text-sm text-slate-500">{t.durasi_menit} menit{t.jumlah_soal > 0 ? `, ${t.jumlah_soal} soal` : ''}</p>
            </div>
            {t.status === 'berjalan' ? <Btn className="!px-4 !py-2" onClick={() => onMulai(t)}>Lanjutkan</Btn>
              : done(t) ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">Skor {t.skor}</span>
              : t.jumlah_soal > 0 ? <Btn className="!px-4 !py-2" onClick={() => onMulai(t)}>Mulai</Btn>
              : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Segera hadir</span>}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [sesi, setSesi] = useState(undefined), [siswa, setSiswa] = useState(undefined), [aktif, setAktif] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesi(data.session))
    const { data } = supabase.auth.onAuthStateChange((_, s) => setSesi(s))
    return () => data.subscription.unsubscribe()
  }, [])
  const muat = async () => { const { data } = await supabase.rpc('siswa_saya'); setSiswa(data?.[0] || null) }
  const uid = sesi?.user?.id
  useEffect(() => { if (uid) muat(); else { setSiswa(undefined); setAktif(null) } }, [uid])
  let isi
  if (sesi === undefined || (sesi && siswa === undefined)) isi = <p className="p-10 text-center text-slate-500">Memuat...</p>
  else if (!sesi) isi = <Login />
  else if (!siswa) isi = <Verifikasi onSelesai={muat} />
  else if (aktif) isi = <Tes tes={aktif} onKembali={() => setAktif(null)} />
  else isi = <Beranda siswa={siswa} onMulai={setAktif} />
  return (<><Header siswa={siswa} onKeluar={() => supabase.auth.signOut()} />{isi}</>)
}
