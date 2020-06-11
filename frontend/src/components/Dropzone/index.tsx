import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'
import { Props } from './interfaces'

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0]

        const fileUrl = URL.createObjectURL(file)
        setSelectedFileUrl(fileUrl)
        onFileUploaded(file)
    }, [onFileUploaded])
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />

            {selectedFileUrl
                ? <img src={selectedFileUrl} alt="Thumbnail" style={{ opacity: 0.65 }} />
                :
                <p>
                    <FiUpload />
                Imagem do estabelecimento
                </p>
            }
        </div>
    )
}

export default React.memo(Dropzone)