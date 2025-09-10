import React, { useRef, useState } from 'react';
import './ImageUpload.css';
import { FaImage, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const ImageUpload = () => {
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleUploadBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            processFiles(Array.from(files));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files) {
            processFiles(Array.from(files));
        }
    };

    const processFiles = (newFiles) => {
        if (uploadedFiles.length + newFiles.length > 4) {
            alert('Você pode adicionar no máximo 4 imagens.');
            return;
        }

        const filesWithPreview = newFiles.map(file => ({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
            status: 'loading' // Adiciona o estado inicial de 'loading'
        }));

        setUploadedFiles(prevFiles => [...prevFiles, ...filesWithPreview]);

        filesWithPreview.forEach(fileWithPreview => {
            // Simula um carregamento de 1 segundo (aqui você faria o upload real para o servidor)
            setTimeout(() => {
                setUploadedFiles(prevFiles => 
                    prevFiles.map(f => 
                        f.name === fileWithPreview.name ? { ...f, status: 'completed' } : f
                    )
                );
            }, 1000);
        });
    };

    const handleDeleteFile = (fileName) => {
        setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
    };

    const renderFileItem = (file, index) => (
        <div key={index} className="thumbnail-item">
            <img src={file.url} alt={`Thumbnail ${index + 1}`} />
            <div className="file-info">
                <span>{file.name}</span>
                {file.status === 'loading' && (
                    <div className="progress-bar">
                        <div className="progress loading"></div>
                    </div>
                )}
                {file.status === 'completed' && (
                    <FaCheckCircle className="checkmark-icon" />
                )}
            </div>
            <FaTrashAlt className="delete-icon" onClick={() => handleDeleteFile(file.name)} />
        </div>
    );

    return (
        <div className="image-upload-container">
            <h3>Imagem</h3>
            <div 
                className={`upload-box ${isDragging ? 'dragging' : ''}`}
                onClick={handleUploadBoxClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <FaImage className="upload-icon" />
                <p>Solte a imagem aqui</p>
                <p>.jpg, .png, .gif allowed</p>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                multiple
                accept=".jpg,.jpeg,.png,.gif"
            />

            <div className="thumbnail-list">
                {uploadedFiles.length > 0 ? (
                    uploadedFiles.map(renderFileItem)
                ) : (
                    <p className="no-files-message">Nenhuma imagem selecionada.</p>
                )}
            </div>
            
            <div className="action-buttons">
                <button className="save-btn">SALVAR</button>
                <button className="delete-btn">APAGAR</button>
                <button className="cancel-btn">CANCELAR</button>
            </div>
        </div>
    );
};

export default ImageUpload;