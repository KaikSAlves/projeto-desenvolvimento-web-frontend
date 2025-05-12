import ImageWithLoading from './ImageWithLoading';

const ProductCard = ({ name, description, price, image, isHighlight }) => {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <ImageWithLoading 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isHighlight && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white p-2 rounded-full transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <span className="text-lg">⭐</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">{name}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary font-bold text-lg">
            R$ {price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;