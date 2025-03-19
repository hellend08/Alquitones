import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const ShareProduct = ({product, onClose}) => {
    const [customMessage, setCustomMessage] = useState("");
    if (!product) return null;

    const productUrl = `${window.location.origin}/detail/${product.id}`;

    const shareOnSocialMedia = (platform) => {
        const productUrl = `${window.location.origin}/detail/${product.id}`;
        const message = `${customMessage} - Mira este producto: ${product.name} - ${product.description} `;

        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(message)}`;
                break;
            case "whatsapp":
                shareUrl = `https://wa.me/?text=${encodeURIComponent(message + " " + productUrl)}`;
                break;
            case "email":
                shareUrl = `mailto:?subject=${encodeURIComponent("Mira este producto")}&body=${encodeURIComponent(message + " " + productUrl)}`;
                break;
            default:
                return;
        }
        window.open(shareUrl, "_blank");
    };

    return (
        <section className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Comparte este producto</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        ✖
                    </button>
                </div>
                <div className="flex items-center gap-3 my-4">
                    <img 
                        src={product.images?.[0] || product.mainImage || 'https://via.placeholder.com/100'} 
                        alt={product.name} 
                        className="w-16 h-16 rounded-md object-cover" 
                    />
                    <div>
                        <p className="text-sm text-gray-700 font-semibold">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.description}</p>
                    </div>
                </div>
                <textarea 
                    className="w-full rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                    placeholder="Escribe un mensaje..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3 my-4">
                    <button className="p-1 border-1 border-gray-300 text-(--color-secondary) rounded cursor-pointer hover:bg-gray-100" onClick={() => shareOnSocialMedia("facebook")}>
                        <i className="fab fa-facebook mr-2"></i> <span className="text-sm">Facebook</span>
                    </button>
                    <button className="p-1 border-1 border-gray-300 text-(--color-secondary) rounded cursor-pointer hover:bg-gray-100" onClick={() => shareOnSocialMedia("twitter")}>
                        <i className="fab fa-twitter mr-2"></i> <span className="text-sm">Twitter</span>
                    </button>
                    <button className="p-1 border-1 border-gray-300 text-(--color-secondary) rounded cursor-pointer hover:bg-gray-100" onClick={() => shareOnSocialMedia("whatsapp")}>
                        <i className="fab fa-whatsapp mr-2"></i> <span className="text-sm">Whatsapp</span>
                    </button>
                    <button className="p-1 border-1 border-gray-300 text-(--color-secondary) rounded cursor-pointer hover:bg-gray-100" onClick={() => shareOnSocialMedia("email")}>
                        <i className="fas fa-envelope mr-2"></i> <span className="text-sm">Correo</span>
                    </button>
                </div>
                <Link to={productUrl} className="text-sm text-(--color-secondary) hover:text-blue-600">{productUrl}</Link>
            </div>
        </section>
    )
}
export default ShareProduct