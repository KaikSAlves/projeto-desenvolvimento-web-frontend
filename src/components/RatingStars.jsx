import { FaStar, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, setRating, disabled = false }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button 
          key={star}
          onClick={() => !disabled && setRating(star)}
          className={`text-2xl ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          type="button"
          aria-label={`Avaliar com ${star} estrelas`}
        >
          {star <= rating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </button>
      ))}
    </div>
  );
};

export default RatingStars;