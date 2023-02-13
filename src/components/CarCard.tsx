import {FC, useMemo} from "react";
import {IModel} from "@/lib/IModel";
import {cdnUri} from "@/components/utils";
import Link from "next/link";
import Image from "next/image";

type Props = FC<IModel>

const CarCard: Props = ({title, description, frames, uid}) => {
    const thumbnail = useMemo(() => {
        const middleFrame = Math.ceil(frames.length / 4)
        return cdnUri(frames[middleFrame - 1])
    }, [])

    return (
        <div className="w-full">
            <Link href={`/${uid}`} className={"block hover:grow hover:shadow-xl rounded-xl overflow-hidden relative"}>
                <Image
                    width={600}
                    height={350}
                    priority
                    src={thumbnail} alt={title}/>
                <div
                    className={"absolute inset-0 bg-gray-900 opacity-0 hover:opacity-60 flex justify-center items-center"}>
                    <div className={"mb-20"}>
                        <svg className="w-12 h-12 text-yellow-500 mx-auto"
                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor"
                             viewBox="0 0 384 512">
                            <path
                                d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/>
                        </svg>
                        <p className={"text-white mt-2 font-bold uppercase"}>
                            360 Walkthrough
                        </p>
                    </div>
                </div>
                <div className="content p-4 bg-gray-900 text-white relative z-1 pointer-events-none">
                    <div className="flex items-center justify-between rounded-b-2xl overflow-hidden">
                        <h4 className="text-white text-lg font-bold">{title}</h4>
                    </div>
                    <p className={"text-gray-400 font-light"}>
                        {description}
                    </p>
                </div>
            </Link>
        </div>
    )
}

export default CarCard
