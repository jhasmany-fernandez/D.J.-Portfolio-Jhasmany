import ThemeMenu from '@/components/Theme/ThemeMenu'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ThemeMenu />
    </>
  )
}