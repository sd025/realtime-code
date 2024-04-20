import { Link } from "react-router-dom"

const PrimaryButton = ({ text, link, onClickFunc }) => {
  return (
    <div className="primary-button-container">
      {link ? (
        <Link href={link}>
          <button
            className="primary-button"
            type="submit"
          >
            {text}
          </button>
        </Link>
      ) : (
        <button
          onClick={onClickFunc}
          className="primary-button"
          type="submit"
        >
          {text}
        </button>
      )}
    </div>
  )
}

export default PrimaryButton
