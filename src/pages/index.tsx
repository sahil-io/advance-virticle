import Head from 'next/head'
import Image from 'next/image'
import {Inter} from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import {useEffect} from "react";
import useSWR from 'swr'
import {IModel} from "@/lib/IModel";


const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function Home() {

    const {data, error, isLoading} = useSWR<IModel[]>('/api/models', fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
    })


    return (
        <>
            <Head>
                <title>Advance Auto | Virticle</title>
                <meta name="description" content="Advance Auto Virtual Garage"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main
                className={"bg-gray-100 text-gray-600 work-sans leading-normal text-base tracking-normal min-h-screen"}>
                <Navbar/>

                <section className="py-12">
                    <div className="container mx-auto">
                        <h1 className={"text-xl text-black mb-1 uppercase tracking-wide"}>
                            Browse Our Virtual Garage
                        </h1>
                        <hr/>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">

                            {isLoading && [1, 2, 3].map(idx => <div className="w-full" key={idx}>
                                <div role="status"
                                     className="flex items-center justify-center h-72 max-w-sm bg-gray-300 rounded-lg animate-pulse dark:bg-gray-200">
                                    <svg className="w-12 h-12 text-gray-200 dark:text-gray-600"
                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor"
                                         viewBox="0 0 384 512">
                                        <path
                                            d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>)}

                            {data?.map(model => <CarCard {...model} key={model.uid}/>)}

                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}


