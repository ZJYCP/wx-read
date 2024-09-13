import { EntryUrl } from "@/utils/entry_utils";
import Image from "next/image";

export default async function Home() {
  const entryUrls = await EntryUrl.get_all_entry_url();
  const getImageUrl = (index: number): string => {
    const imageTypes = [
      (i: number) => `https://picsum.photos/seed/${i}/200`,
      (i: number) => `https://robohash.org/${i}?size=200x200&set=set2`,
    ];
    return imageTypes[index % imageTypes.length](index);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <main>
        <h1 className="text-3xl font-bold mb-8 text-center">提供商列表</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {entryUrls.map((provider, index) => (
            <a
              key={index}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full h-48 relative rounded-t-lg overflow-hidden">
                <Image
                  src={provider.image || getImageUrl(index)}
                  alt={provider.name}
                  fill
                  sizes="100%"
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-xl font-semibold">{provider.name}</h2>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
