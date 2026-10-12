import { useEffect, useState } from 'react'
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

function Beranda({ siswa }) {
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
            {t.status !== 'belum' ? <span className="text-sm text-slate-500">Selesai</span>
              : t.jumlah_soal > 0 ? <Btn>Mulai</Btn>
              : <span className="text-sm text-slate-400">Segera hadir</span>}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function App() {
  const [sesi, setSesi] = useState(undefined), [siswa, setSiswa] = useState(undefined)
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
  else isi = <Beranda siswa={siswa} />
  return (<><Header nama={siswa?.nama} onKeluar={keluar} />{isi}</>)
}
