import React, { useRef, useState } from 'react';
import '../../styles/ImageUpload.css';
import { FaImage, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

// NOVO: Adiciona a prop 'error'
const ImageUpload = ({ uploadedFiles, onFileChange, onSubmit, error }) => {
    const fileInputRef = useRef(null);
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
        const filesToAdd = newFiles.filter(
            (newFile) => !uploadedFiles.some((existingFile) => existingFile.name === newFile.name)
        );

        if (uploadedFiles.length + filesToAdd.length > 4) {
            alert(`Você pode adicionar no máximo 4 imagens. Você já tem ${uploadedFiles.length} e tentou adicionar ${filesToAdd.length}.`);
            return;
        }

        const filesWithPreview = filesToAdd.map(file => ({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
            status: 'loading'
        }));

        onFileChange(prevFiles => [...prevFiles, ...filesWithPreview]);

        filesWithPreview.forEach(fileWithPreview => {
            setTimeout(() => {
                onFileChange(prevFiles =>
                    prevFiles.map(f =>
                        f.name === fileWithPreview.name ? { ...f, status: 'completed' } : f
                    )
                );
            }, 1000);
        });
    };

    const handleDeleteFile = (fileName) => {
        onFileChange(prevFiles => prevFiles.filter(file => file.name !== fileName));
    };

const renderFileItem = (file, index) => (
        <div key={file.name} className="thumbnail-item">
            <img src={file.url} alt={`Thumbnail ${index + 1}`} />
            <div className="file-info">
                <span>{file.name}</span>
                {file.status === 'loading' && (
                    <div className="progress-bar">
                        <div className="progress loading"></div>
                    </div>
                )}
                {/* O checkmark é movido para o contêiner de ações */}
            </div>
            {/* CRÍTICO: NOVO CONTÊINER PARA OS ÍCONES */}
            <div className="thumbnail-actions">
                {file.status === 'completed' && (
                    <FaCheckCircle className="checkmark-icon" />
                )}
                <FaTrashAlt className="delete-icon" onClick={() => handleDeleteFile(file.name)} />
            </div>
        </div>
    );

    return (
        <div className="image-upload-container">
            <h3>Imagem</h3>
            {/* Adiciona classe de erro se a prop 'error' estiver presente */}
            <div
                className={`upload-box ${isDragging ? 'dragging' : ''} ${error ? 'has-error' : ''}`}
                onClick={handleUploadBoxClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <FaImage className="upload-icon" />
                <p>Solte ou clique para selecionar imagens</p>
                <p>Até 4 arquivos (.jpg, .png, .gif)</p>
            </div>
            {/* EXIBE O ERRO ABAIXO DO UPLOAD BOX */}
            {error && <p className="image-error-text">{error}</p>} 
            
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
            {uploadedFiles.length > 0 && uploadedFiles.length < 4 && (
                <button type="button" className="add-more-files-btn" onClick={handleUploadBoxClick}>
                    Adicionar mais imagens ({uploadedFiles.length}/4)
                </button>
            )}

        </div>
    );
};

export default ImageUpload;