import Spinner from "./Spinner";

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    className?: string
    isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({ isLoading, className, children, ...otherAttr }) => {
    const combinedClassName = `${className} disabled:opacity-70 px-5 py-2 font-figtree font-bold bg-white rounded-lg text-black200 flex flex-row items-center`
    return (<button
        className={combinedClassName}
        {...otherAttr}
    >
        {isLoading ? <Spinner className="!ml-0" /> : children}
    </button>);
}

export default Button;