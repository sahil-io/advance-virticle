import {FC} from "react";
import Image from "next/image";
import Logo from '../../public/logo.png'
import VirticleLogo from '../../public/viticle-logo.png'
import Link from "next/link";


const Navbar: FC = () => {
    return (
        <>
            {/*Nav*/}
            <nav id="header" className="w-full z-30 top-0 py-1 bg-white">
                <div className="w-full container mx-auto flex flex-wrap items-center md:justify-center mt-0 px-6 py-3 relative">


                    <div>
                        <Link
                            className="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "
                            href="/"
                        >
                            <Image
                                width={200}
                                priority
                                src={Logo} alt={"Advance Auto Logo"}/>
                        </Link>
                    </div>
                    <div className={"flex items-center gap-2 text-black font-light text-sm opacity-50 absolute right-2 inset-y-0 scale-50 md:scale-100"}>
                        Powered by <Image src={VirticleLogo} width={100} alt={"Virticle Logo"}/>
                    </div>

                </div>
            </nav>
        </>
    )
}

export default Navbar
