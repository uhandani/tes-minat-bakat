import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

const Btn = ({ className = '', ...p }) => (
  <button className={'rounded-lg bg-[#67338a] px-5 py-2.5 font-semibold text-white hover:bg-[#4a1f6b] disabled:opacity-40 ' + className} {...p} />
)
const Card = ({ children }) => <div className="my-4 rounded-xl border border-[#ddd3e6] bg-white p-5">{children}</div>
const Input = (p) => <input className="mt-1 w-full rounded-lg border border-[#ddd3e6] p-2.5" {...p} />

function Header({ nama, onKeluar }) {
  return (
    <header className="flex items-center gap-3 border-b-4 border-[#f5e51b] bg-white px-4 py-2.5">
      <img src="/logo.png" alt="Logo SMAIT Alia Tangerang" className="h-12" />
      <div className="flex-1">
        <b className="block leading-tight tracking-wide text-[#4a1f6b]">APTITUDE TEST</b>
        <span className="text-xs tracking-wider text-slate-500">SMAIT ALIA TANGERANG</span>
      </div>
      {nama && (
        <div className="text-right text-sm">
          <div className="font-semibold">{nama}</div>
          <button onClick={onKeluar} className="text-[#67338a] underline">Keluar</button>
        </div>
      )}
    </header>
  )
}

function Login() {
  const masuk = () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <Card>
        <h1 className="text-2xl font-bold tracking-tight">Masuk</h1>
        <p className="mb-5 mt-1 text-sm text-slate-600">Gunakan akun Google kamu. Pertama kali masuk, kamu diminta memverifikasi NIS dan NISN.</p>
        <Btn onClick={masuk} className="w-full">Masuk dengan Google</Btn>
      </Card>
    </div>
  )
}

function Verifikasi({ onSelesai }) {
  const [nis, setNis] = useState(''), [nisn, setNisn] = useState('')
  const [calon, setCalon] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const cek = async () => {
    setErr(''); setBusy(true)
    const { data } = await supabase.rpc('cek_siswa', { p_nis: nis, p_nisn: nisn })
    setBusy(false)
    if (data?.length) setCalon(data[0])
    else setErr('NIS dan NISN tidak cocok, atau sudah dipakai akun lain. Hubungi guru jika kamu yakin datanya benar.')
  }
  const tautkan = async () => {
    setBusy(true)
    const { data } = await supabase.rpc('tautkan_siswa', { p_nis: nis, p_nisn: nisn })
    setBusy(false)
    data ? onSelesai() : setErr('Gagal menautkan akun. Hubungi guru.')
  }
  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <Card>
        {!calon ? (
          <>
            <h1 className="text-xl font-bold">Verifikasi siswa</h1>
            <p className="mb-3 text-sm text-slate-600">Isi sekali saja. NISN ada di kartu NISN kamu.</p>
            <label className="text-sm font-semibold">NIS</label><Input value={nis} onChange={(e) => setNis(e.target.value)} inputMode="numeric" />
            <label className="mt-3 block text-sm font-semibold">NISN</label><Input value={nisn} onChange={(e) => setNisn(e.target.value)} inputMode="numeric" />
            <p className="my-2 min-h-5 text-sm text-red-700">{err}</p>
            <Btn onClick={cek} disabled={busy || !nis || !nisn}>Periksa</Btn>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600">Apakah ini kamu?</p>
            <h2 className="text-xl font-bold">{calon.nama}</h2>
            <p className="mb-4">Kelas {calon.kelas}</p>
            <p className="min-h-5 text-sm text-red-700">{err}</p>
            <div className="flex gap-3">
              <Btn onClick={tautkan} disabled={busy}>Ya, ini saya</Btn>
              <button onClick={() => setCalon(null)} className="rounded-lg border border-[#ddd3e6] px-5 py-2.5">Bukan</button>
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
  if (err) return <div className="mx-auto max-w-xl px-4 py-8"><Card><p className="text-red-700">{err}</p><Btn className="mt-3" onClick={onKembali}>Kembali</Btn></Card></div>
  if (hasil) return <div className="mx-auto max-w-xl px-4 py-8"><Card><h2 className="text-xl font-bold">{tes.nama} selesai</h2><p className="my-2">Benar {hasil.benar} dari {hasil.total} soal (skor {hasil.skor}).</p><Btn onClick={onKembali}>Kembali ke daftar tes</Btn></Card></div>
  if (!d) return <p className="p-8 text-center text-slate-500">Memuat soal...</p>
  const q = d.soal[i], n = d.soal.length
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{tes.nama}, soal {i + 1} dari {n}</p>
        <b className={'text-xl tabular-nums ' + (sisa <= 60 ? 'text-red-700' : '')}>{Math.floor(sisa / 60)}:{String(sisa % 60).padStart(2, '0')}</b>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded bg-[#ddd3e6]"><div className="h-full bg-[#67338a]" style={{ width: ((i + 1) / n) * 100 + '%' }} /></div>
      <Card>
        <p className="mb-3">{q.q}</p>
        {q.o.map((o, j) => (
          <button key={j} onClick={() => pilih(q.nomor, j)}
            className={'my-1.5 block w-full rounded-lg border p-2.5 text-left ' + (jw.current[q.nomor] === j ? 'border-[#67338a] bg-[#f1e8f7] ring-2 ring-[#67338a]' : 'border-[#ddd3e6] bg-white')}>{o}</button>
        ))}
      </Card>
      <div className="flex justify-between">
        <button disabled={!i} onClick={() => setI(i - 1)} className="rounded-lg border border-[#ddd3e6] px-5 py-2.5 disabled:opacity-40">Sebelumnya</button>
        {i < n - 1 ? <Btn onClick={() => setI(i + 1)}>Berikutnya</Btn>
          : <Btn onClick={() => Object.keys(jw.current).length < n ? alert('Masih ada soal yang belum dijawab.') : kirim()}>Selesaikan tes</Btn>}
      </div>
    </div>
  )
}

function Beranda({ siswa, onMulai }) {
  const [tes, setTes] = useState(null)
  useEffect(() => { supabase.rpc('daftar_tes').then(({ data }) => setTes(data || [])) }, [])
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">Halo, {siswa.nama}</h1>
      <p className="text-sm text-slate-600">Kelas {siswa.kelas}. Waktu tiap tes mulai berjalan saat kamu menekan Mulai.</p>
      {tes === null && <p className="mt-4 text-slate-500">Memuat...</p>}
      {tes?.map((t) => (
        <Card key={t.id}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <b>{t.nama}</b>
              <p className="text-sm text-slate-500">{t.durasi_menit} menit{t.jumlah_soal > 0 ? `, ${t.jumlah_soal} soal` : ''}</p>
            </div>
            {t.status === 'berjalan' ? <Btn onClick={() => onMulai(t)}>Lanjutkan</Btn>
              : t.status !== 'belum' ? <span className="text-sm text-slate-500">{`Selesai, skor ${t.skor}`}</span>
              : t.jumlah_soal > 0 ? <Btn onClick={() => onMulai(t)}>Mulai</Btn>
              : <span className="text-sm text-slate-400">Segera hadir</span>}
          </div>
        </Card>
      ))}
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
  useEffect(() => { if (uid) muat(); else setSiswa(undefined) }, [uid])
  const keluar = () => supabase.auth.signOut()
  let isi
  if (sesi === undefined || (sesi && siswa === undefined)) isi = <p className="p-8 text-center text-slate-500">Memuat...</p>
  else if (!sesi) isi = <Login />
  else if (!siswa) isi = <Verifikasi onSelesai={muat} />
  else if (aktif) isi = <Tes tes={aktif} onKembali={() => setAktif(null)} />
  else isi = <Beranda siswa={siswa} onMulai={setAktif} />
  return (<><Header nama={siswa?.nama} onKeluar={keluar} />{isi}</>)
}
