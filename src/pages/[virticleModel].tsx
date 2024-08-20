import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import {ScanCommand} from "@aws-sdk/lib-dynamodb";
import {ddbDocClient} from "@/pages/api/models";
import {
    GetItemCommand,

} from '@aws-sdk/client-dynamodb';
import {unmarshall} from "@aws-sdk/util-dynamodb";

import {IModel} from "@/lib/IModel";
import CarViewer from "@/components/CarViewer";
import {BiArrowBack} from "react-icons/bi";
import Link from "next/link";

type Props = {
    model: IModel
}

const VirticleModel: NextPage<Props> = ({model}) => {

    return (
        <>
            <Head>
                <title>Virticle</title>
                <meta name="description" content="Advance Auto Virtual Garage"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main
                className={"bg-black text-gray-600 work-sans leading-normal text-base tracking-normal min-h-screen"}>
              
                    <CarViewer model={model}/>
            </main>
        </>
    )
}

export default VirticleModel


export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps<Props, { virticleModel: string }> = async ({params}) => {

    if (!params?.virticleModel) {
        return {
            notFound: true
        }
    }

    const command = new GetItemCommand(
        {
            TableName: process.env.TABLE_NAME,
            Key: {
                uid: {S: params.virticleModel}
            },
        }
    )
    const response = await ddbDocClient.send(command)

    if (!response['Item']) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            model: unmarshall(response['Item'] as any) as unknown as IModel
        }
    }
}
