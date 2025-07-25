import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SERVER_URL } from "~/utils/api";

type PageContent = {
    id: number;
    title: string;
    body: string;
    image: string;
    video: string;
    menu: {
        id: number;
        name: string;
        slug: string;
    };
};

export const loader: LoaderFunction = async ({ params }) => {
    const slug = params.slug;
    const res = await fetch(`${SERVER_URL}/pages/all/`);
    const data = await res.json();
    const matched = data.results.find(
        (item: PageContent) => item.menu.slug === slug
    );
    if (!matched) {
        throw new Response("Not Found", { status: 404 });
    }
    return json(matched);
}

export default function PageSlug() {
    const page = useLoaderData<PageContent>();

    return (
        <main className="relative top-0 left-0 right-0 w-full py-5">
            <div className="max-w-screen-2xl container mx-auto px-2.5 lg:px-5">
                <div className="flex flex-col flex-wrap gap-y-5">
                    {page.title && (
                        <h1 className="text-3xl font-bold mb-4 text-center">{page.title}</h1>
                    )}

                    {page.image && (
                        <img src={page.image} alt={page.title} className="mb-4 rounded" />
                    )}

                    {page.video && (
                        <video controls className="mt-4 w-full rounded">
                            <source src={page.video} type="video/mp4" />
                        </video>
                    )}
                    {page.body && (
                        <div
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: page.body }}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
