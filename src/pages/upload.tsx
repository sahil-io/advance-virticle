import {NextPage} from "next";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import {useDropzone} from 'react-dropzone';
import axios from "axios";
import {useMemo, useRef, useState} from "react";

const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    justifyContent: 'center',
    height: 100,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


const Upload: NextPage = () => {
    const {
        acceptedFiles, getRootProps, getInputProps, isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        maxFiles: 1,
        multiple: false,
        accept: {'video/*': []}
    });

    const [uploading, setUploading] = useState(false)

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const files = acceptedFiles.map((file: any) => (
        <li className={"list-disc list-inside"} key={file.path}>
            <span className={"text-blue-900"}>{file.path}</span> <span
            className={"font-light text-sm bg-gray-100"}>{Math.round(file.size / 1024 / 1024)} MB</span>
        </li>
    ));

    const API_ENDPOINT = `https://k7fj4ytp47.execute-api.us-west-2.amazonaws.com/beta/virticle-file-upload`

    // @ts-ignore
    const handleChangeStatus = ({meta, remove}, status) => {
        console.log(status, meta);
    };

    const handleSubmit = async (ev: any) => {
        ev.preventDefault()


        if (!acceptedFiles[0]) {
            alert('Please upload a file')
            return
        }

        const fields = new FormData(ev.target)

        const f = acceptedFiles[0];
        setUploading(true)
        // GET request: pre-signed URL
        const response = await axios.request({
            method: "POST",
            url: API_ENDPOINT,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                uid: fields.get('uid'),
                title: fields.get('title'),
                description: fields.get('description')
            }
        });

        if (!response.data.url) {
            return
        }
        // PUT request: upload file to S3
        const result = await fetch(response.data.url, {
            method: "PUT",
            body: f,
        })
            .then(() => {
                ev.target?.reset()
            })
            .finally(() => {
                setUploading(false)
            });
    };


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

                        <div className={"text-right"}>
                            <button
                                onClick={() => {
                                    (document.querySelector('#uplaoderForm') as HTMLFormElement)?.reset()

                                }}
                                className="mb-2 border-2 border-blue-500 hover:border-blue-700 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button">
                                Clear All
                            </button>
                        </div>

                        {    /* @ts-ignore */}
                        <div {...getRootProps({style})}>
                            <input {...getInputProps()} required/>
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        {acceptedFiles?.length > 0 && <aside className={"p-3 bg-white mb-4"}>
                            <h4 className={"font-medium mb-2"}>File Selected</h4>
                            <ul>{files}</ul>
                        </aside>}
                        <form onSubmit={handleSubmit} id={"uplaoderForm"}>

                            <div className="grid grid-cols-1 gap-6 mt-4">
                                <label className="block">
                                    <span className="text-gray-700">UID</span>
                                    <input required name={"uid"} type="text" className="mt-1 block w-full"
                                           placeholder=""/>
                                </label>

                                <label className="block">
                                    <span className="text-gray-700">Title</span>
                                    <input required name={"title"} type="text" className="mt-1 block w-full"
                                           placeholder=""/>
                                </label>

                                <label className="block">
                                    <span className="text-gray-700">Description</span>
                                    <input required name={"description"} type="text" className="mt-1 block w-full"
                                           placeholder=""/>
                                </label>

                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:pointer-events-none disabled:opacity-50"
                                    disabled={uploading}
                                    type="submit">
                                    {uploading ? 'Uploading file....' : 'Upload'}
                                </button>
                                {uploading && <div className="flex justify-center items-center">
                                    <div
                                        className="animate-pulse "
                                        role="status">
                                        DO NOT CLOSE THIS TAB OR WINDOW
                                    </div>
                                </div>}

                            </div>
                        </form>
                    </div>
                </section>

            </main>

        </>
    )
}

export default Upload
