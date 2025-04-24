import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import RatingStars from '../components/RatingStars';

// Definindo os produtos FORA do componente
const produtos = {
    geladinhos: [
        {
            id: 1,
            name: 'Geladinho de Coco',
            description: 'Refrescante geladinho de coco natural',
            price: 2.50,
            image: '/images/geladinho-coco.jpeg',
            isHighlight: true
        },
        {
            id: 2,
            name: 'Geladinho de Uva',
            description: 'Delicioso geladinho sabor uva',
            price: 2.50,
            image: '/images/geladinho-uva.jpeg',
            isHighlight: false
        },
        {
            id: 3,
            name: 'Geladinho de Manga',
            description: 'Geladinho tropical de manga fresca',
            price: 2.50,
            image: '/images/geladinho-manga.jpeg',
            isHighlight: true
        },
        {
            id: 4,
            name: 'Geladinho de Morango',
            description: 'Refrescante geladinho sabor morango',
            price: 2.50,
            image: '/images/geladinho-morango.jpeg',
            isHighlight: true
        },
        {
            id: 5,
            name: 'Geladinho de Amendoim',
            description: 'Cremoso geladinho sabor amendoim',
            price: 3.00,
            image: '/images/geladinho-amendoim.jpeg',
            isHighlight: true
        },
        {
            id: 6,
            name: 'Geladinho de Maracujá',
            description: 'Refrescante geladinho de maracujá',
            price: 2.50,
            image: '/images/geladinho-maracuja.jpeg',
            isHighlight: false
        }
    ],
    picoles: [
        {
            id: 1,
            name: 'Picolé de Açaí',
            description: 'Picolé nutritivo de açaí com granola',
            price: 5.50,
            image: '/images/picole-acai.jpeg',
            isHighlight: true
        },
        {
            id: 2,
            name: 'Picolé de Limão',
            description: 'Refrescante picolé de limão',
            price: 4.00,
            image: '/images/picole-limao.jpeg',
            isHighlight: false
        },
        {
            id: 3,
            name: 'Picolé de Abacaxi',
            description: 'Picolé tropical de abacaxi',
            price: 4.50,
            image: '/images/picole-abacaxi.jpeg',
            isHighlight: false
        },
        {
            id: 4,
            name: 'Picolé de Coco',
            description: 'Picolé cremoso de coco natural',
            price: 4.50,
            image: '/images/picole-coco.jpeg',
            isHighlight: true
        },
        {
            id: 5,
            name: 'Picolé de Chocolate',
            description: 'Picolé cremoso coberto com chocolate',
            price: 5.00,
            image: '/images/picole-chocolate.jpeg',
            isHighlight: true
        },
        {
            id: 6,
            name: 'Picolé de Manga',
            description: 'Picolé refrescante de manga',
            price: 4.50,
            image: '/images/picole-manga.jpeg',
            isHighlight: false
        },
        {
            id: 7,
            name: 'Picolé de Maracujá',
            description: 'Picolé refrescante de maracujá',
            price: 4.50,
            image: '/images/picole-maracuja.jpeg',
            isHighlight: false
        },
        {
            id: 8,
            name: 'Picolé de Morango',
            description: 'Picolé de morango natural',
            price: 4.50,
            image: '/images/picole-morango.jpeg',
            isHighlight: true
        },
        {
            id: 9,
            name: 'Picolé de Leite Condensado',
            description: 'Picolé cremoso de leite condensado',
            price: 5.00,
            image: '/images/picole-leite-condensado.jpeg',
            isHighlight: true
        }
    ]
};

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('geladinhos');
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [feedbackEnviado, setFeedbackEnviado] = useState(false);

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert('Por favor, selecione uma avaliação');
            return;
        }

        const novoFeedback = {
            id: Date.now(),
            avaliacao: rating,
            comentario: feedback,
            data: new Date().toISOString()
        };

        // Salva o feedback no localStorage
        const feedbacksSalvos = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        localStorage.setItem('feedbacks', JSON.stringify([...feedbacksSalvos, novoFeedback]));

        // Limpa o formulário
        setRating(0);
        setFeedback('');
        setFeedbackEnviado(true);

        // Reseta o estado de feedback enviado após 3 segundos
        setTimeout(() => {
            setFeedbackEnviado(false);
        }, 3000);
    };

    return (
        <main className="font-body">
            {/* Seção Hero */}
            <section 
                id="inicio" 
                className="relative min-h-screen bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: 'url("/images/bg-hero.jpeg")'
                }}
            >
                {/* Overlay escuro com baixa opacidade */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
                
                <div className="relative container mx-auto px-4 text-center min-h-screen flex flex-col justify-center">
                    <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-white text-shadow-lg">
                        Experimente o sabor do{' '}
                        <span className="text-summer font-black tracking-wider font-display text-5xl md:text-7xl animate-pulse text-shadow-lg">
                            VERÃO
                        </span>
                    </h1>
                    <p className="font-body text-xl md:text-2xl text-white mb-8 italic text-shadow-md">
                        Explore nosso catálogo e faça sua melhor escolha
                    </p>
                    <button 
                        onClick={() => {
                            document.getElementById('cardapio').scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                        className="bg-primary/90 hover:bg-secondary text-white px-8 py-3 rounded-lg text-lg transition-all font-body transform hover:scale-105 duration-200 mx-auto shadow-xl"
                    >
                        Ver Cardápio
                    </button>
                </div>
            </section>
            
            {/* Seção de Produtos */}
            <section 
                id="cardapio" 
                className="relative py-16"
                style={{
                    backgroundImage: 'url("/images/bg-cardapio.jpeg")',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Overlay escuro com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/30"></div>
                
                <div className="relative container mx-auto px-4">
                    <h2 className="font-display text-4xl font-bold text-center mb-12 text-white text-shadow-lg">
                        Nosso Cardápio
                    </h2>
                    
                    {/* Tabs */}
                    <div className="flex justify-center mb-8">
                        <button
                            onClick={() => setActiveTab('geladinhos')}
                            className={`px-8 py-3 rounded-l-lg font-body text-lg transition-all duration-300 ${
                                activeTab === 'geladinhos'
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Geladinhos
                        </button>
                        <button
                            onClick={() => setActiveTab('picoles')}
                            className={`px-8 py-3 rounded-r-lg font-body text-lg transition-all duration-300 ${
                                activeTab === 'picoles'
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Picolés
                        </button>
                    </div>

                    {/* Grid de Produtos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {produtos[activeTab]?.map((produto) => (
                            <ProductCard key={produto.id} {...produto} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Seção de Feedback */}
            <section 
                id="feedback" 
                className="relative py-16"
                style={{
                    backgroundImage: 'url("/images/bg-feedback.jpeg")',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Overlay escuro com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/35"></div>
                
                <div className="relative container mx-auto px-4">
                    <h2 className="font-display text-4xl font-bold text-center mb-12 text-white text-shadow-lg">
                        Sua Opinião
                    </h2>
                    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
                        <form onSubmit={handleSubmitFeedback} className="space-y-6">
                            <div className="flex flex-col items-center">
                                <label className="mb-4 text-lg font-semibold">Avalie nossos produtos</label>
                                <RatingStars rating={rating} setRating={setRating} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Comentário (opcional)
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                                    rows="4"
                                />
                            </div>

                            {feedbackEnviado && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    Obrigado pelo seu feedback!
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg transition-colors"
                            >
                                Enviar Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Seção de Contato */}
            <section 
                id="contato" 
                className="relative py-16"
                style={{
                    backgroundImage: 'url("/images/bg-contato.jpeg")',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                }}
            >
                {/* Overlay escuro com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-black/25 to-black/30"></div>
                
                <div className="relative container mx-auto px-4">
                    <h2 className="font-display text-4xl font-bold text-center mb-12 text-white text-shadow-lg">
                        Entre em Contato
                    </h2>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Informações de Contato */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="font-display text-2xl font-bold text-primary mb-6">
                                Nosso Endereço
                            </h3>
                            <div className="space-y-4">
                                <p className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Rua Anum Dourado, 43
                                </p>
                                <p className="flex items-start text-gray-600 pl-8">
                                    São Paulo - SP
                                </p>
                                <p className="flex items-start text-gray-600 pl-8">
                                    CEP: 03005-390
                                </p>
                                <p className="flex items-start text-gray-600 pl-8 italic">
                                    Referência: Localizado no bar do Bahia
                                </p>
                                <p className="flex items-center text-gray-600 mt-4">
                                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    (11) 9999-9999
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    contato@geladinhopicole.com
                                </p>
                            </div>
                            {/* Horário de Funcionamento */}
                            <div className="mt-8">
                                <h4 className="font-display text-xl font-bold text-primary mb-4">
                                    Horário de Funcionamento
                                </h4>
                                <div className="space-y-2 text-gray-600">
                                    <p>Segunda à Sexta: 10h às 19h</p>
                                    <p>Sábado e Domingo: 11h às 20h</p>
                                </div>
                            </div>
                        </div>
                        {/* Formulário de Contato */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="font-display text-2xl font-bold text-primary mb-6">
                                Envie uma Mensagem
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Mensagem</label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        rows="4"
                                        placeholder="Sua mensagem..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                                >
                                    Enviar Mensagem
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Logo e Descrição */}
                        <div>
                            <h3 className="font-display text-2xl font-bold mb-4">Geladinho & Picolé</h3>
                            <p className="text-gray-400">
                                Refrescando seus momentos com sabor e qualidade desde 2024.
                            </p>
                        </div>
                        {/* Links Rápidos */}
                        <div>
                            <h4 className="font-display text-xl font-bold mb-4">Links Rápidos</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#inicio" className="text-gray-400 hover:text-white transition-colors">
                                        Início
                                    </a>
                                </li>
                                <li>
                                    <a href="#cardapio" className="text-gray-400 hover:text-white transition-colors">
                                        Cardápio
                                    </a>
                                </li>
                                <li>
                                    <a href="#feedback" className="text-gray-400 hover:text-white transition-colors">
                                        Feedback
                                    </a>
                                </li>
                                <li>
                                    <a href="#contato" className="text-gray-400 hover:text-white transition-colors">
                                        Contato
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* Redes Sociais */}
                        <div>
                            <h4 className="font-display text-xl font-bold mb-4">Redes Sociais</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">WhatsApp</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>&copy; 2024 Geladinho & Picolé. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default HomePage;