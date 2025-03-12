import LeftSidebar from '@/components/shared/LeftSidebar'
import { Outlet } from 'react-router-dom'

export const RootLayout = () => {
  return (
    <div className="w-full md:flex">

      <LeftSidebar />
      <section className="main-content">
        <Outlet />
      </section>

    </div>
  )
}

export default RootLayout