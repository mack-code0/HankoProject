interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    className?: string
    error?: boolean
}

const Input: React.FC<InputProps> = ({ className, error, ...otherAttr }) => {
    const combinedClassName = `${className} 
    ${error && 'border border-red-600 border-opacity-100 placeholder:text-red-600'} 
    rounded-sm bg-black200 border w-full h-[2.5rem] outline-0 px-3 text-white text-opacity-70 font-inter border-textGrey100 border-opacity-20`

    return (<input
        className={combinedClassName}
        {...otherAttr}
    />);
}

export default Input;