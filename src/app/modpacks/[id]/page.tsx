export default async function ModpackPage({ params }: { params: Promise<{ id: string | number }> }) {
  const { id } = await params

  return (
    <div className="pt-2 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center gap-2">
      Modpack {id}
    </div>
  )
}