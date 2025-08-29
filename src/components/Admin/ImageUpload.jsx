import React from 'react';
import './ImageUpload.css';
import { FaImage, FaCheckCircle } from 'react-icons/fa';

const ImageUpload = () => {
    return (
        <div className="image-upload-container">
            <h3>Imagem</h3>
            <div className="upload-box">
                <FaImage className="upload-icon" />
                <p>Solte a imagem aqui</p>
                <p>.jpg, .png, .gif allowed</p>
            </div>
            <div className="thumbnail-list">
                <div className="thumbnail-item">
                    <img src="https://via.placeholder.com/60x60?text=thumb1" alt="Thumbnail 1" />
                    <span>Produto thumbnail.png</span>
                    <FaCheckCircle className="checkmark-icon" />
                </div>
                <div className="thumbnail-item">
                    <img src="https://via.placeholder.com/60x60?text=thumb2" alt="Thumbnail 2" />
                    <span>Produto thumbnail.png</span>
                    <FaCheckCircle className="checkmark-icon" />
                </div>
                <div className="thumbnail-item">
                    <img src="https://via.placeholder.com/60x60?text=thumb3" alt="Thumbnail 3" />
                    <span>Produto thumbnail.png</span>
                    <FaCheckCircle className="checkmark-icon" />
                </div>
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