export function Component() {
  return (
    <div className="flex h-screen flex-col justify-between">
      {/* <header className="container py-6">
        <nav className="xs:flex-nowrap flex flex-nowrap items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <img src="/logo.gif" alt="logo" className="size-12" />
            <p className="text-xl font-bold">CR-Mentor</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="mr-auto hidden w-full flex-1 sm:block">
              <Search />
            </div>
            <div className="flex items-center gap-5">
              <Button asChild variant="ghost" size="lg">
                <Link to="/quickStart">Dashboard</Link>
              </Button>
            </div>
          </div>
        </nav>
      </header> */}

      <div className="flex-1">
        {/* <Outlet /> */}
        <iframe src="https://landing.cr-mentor.com" className="w-full h-full" />
      </div>
    </div>
  )
}
