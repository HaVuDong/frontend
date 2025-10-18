import { redirect } from "next/navigation"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-primary text-primary-content">
        <div className="card-body">
          <h1>Sân bóng NĐ</h1>
          <h2 className="card-title">Chào mừng bạn đến với Sân Bóng NĐ!</h2>
          <div className="card-actions justify-end">
            <button className="btn btn-secondary">Đặt sân ngay</button>
          </div>
        </div>
      </div>
    </main>
  )
}

