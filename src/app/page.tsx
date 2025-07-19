import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModpack } from "./dal/modpacks";
import Image from "next/image";

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: number, limit?: number }> }) {
  const { page, limit } = await searchParams
  const atm10 = await getModpack()
  return (
    <div className="pt-2 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 items-center gap-2">
      {
        Array.from({ length: 20 }).map((_, index) => (
          <a key={index} href={`/modpacks/${index}`}>
            <Card>
              <CardHeader>
                <CardTitle>Modpack {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[32px_auto] gap-4 items-center">
                  <div className="w-8 h-8 relative">
                    <Image
                      fill
                      src='/file.svg'      
                      alt={`Modpack ${index}`}     
                      className="rounded-md"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+Z+hHgAHagJ5AEAVSAAAAABJRU5ErkJggg=="
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>
                      Avg Completion time:
                    </span>
                    <span>
                      Avg 100% Completion time:
                    </span>
                    <span>
                      Number of completions:
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))
      }
      {
        JSON.stringify(atm10, null, 2)
      }
    </div>
  );
}
